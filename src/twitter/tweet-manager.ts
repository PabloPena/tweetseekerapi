import { TweetStream } from "./model/tweet-stream.model";
import { Tweet } from "../api/model/tweet.model";
import { TweetFilter } from "../api/model/tweet-filter.model";
import { TweetStreamManager } from "./tweet-stream-manager";
import { ApiError } from "../api/common/api-error";
import TweetRepository from "../respositories/tweet.repository";
import TweetStreamRulesRepository from "../respositories/tweet-stream-rules.repository";
import { TweetPageRequest } from "../api/model/tweet-page-request";
import { TweetPageResponseCollection } from "../api/model/tweet-page-response-collection";
import { ApiReponseCollection } from "../api/common/api-response-collection.model";
import request from "request";

export class TweetManager {

    static activeStreamByBroadcast: any = {};
    static usersCached: any = {};

    /**
     * Manage new search latest tweets request
     * @param filter the tweet filter
     * @returns tweet collection
     */
    static searchUserTweets(broadcastId: string, filter: TweetFilter, pageConfig: TweetPageRequest): Promise<TweetPageResponseCollection> {
        this.finishBroadcastStream(broadcastId);
        return new Promise<TweetPageResponseCollection>(async (resolve, reject) => {
            try {
                let user = this.usersCached[filter.username];
                if (!user){
                    // User is not catched
                    user = await TweetRepository.findUser(null, filter.username);
                    this.usersCached[filter.username] = user;
                }
                resolve(TweetRepository.findUserTweets(user, filter, pageConfig))
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * Manage new search latest tweets request
     * @param filter the tweet filter
     * @returns tweet collection
     */
    static searchLatest(broadcastId: string, filter: TweetFilter, pageConfig: TweetPageRequest): Promise<ApiReponseCollection> {
        this.finishBroadcastStream(broadcastId);
        return TweetRepository.findRecentTweets(filter, pageConfig);
    }

    /**
     * Manager new listen new tweets request
     * @param filter the tweet filter
     * @returns if stream has initialized succesfully
     */
    static async listenTweets(broadcastId: string, filter: TweetFilter) {
        try {
            // Load new rules
            const rules = getRulesFromFilter(filter);
            
            // Clean rules
            let currentRules: any = await TweetStreamRulesRepository.getAllRules();
            if (currentRules.data?.length > 0) await TweetStreamRulesRepository.deleteAllRules(currentRules.data);

            // Setup new rules
            await TweetStreamRulesRepository.setRules(rules);

            // Listen to the stream
            const newStream = await TweetStreamManager.connectToStream(broadcastId);
            
            this.activeStreamByBroadcast[broadcastId] = newStream;

            return;
        } catch (e) {
            const err: ApiError = {
                code: 'TSERR001',
                message: 'Error requesting data from Twitter Dev Api. Number of attempts excedeed',
            };
            return err;
        }
    }

    static finishBroadcastStream(broadcastId: string){
        const stream: request.Request = this.activeStreamByBroadcast[broadcastId];
        if (stream) {
            stream.abort();
        }
    }

}


const getRulesFromFilter = (tweetFilter: TweetFilter) => {
    const rules = [];

    let ruleValue: string;
    if (tweetFilter?.keywords || tweetFilter?.username || tweetFilter?.hashtag) {
        ruleValue = ''
    }
    if (tweetFilter?.keywords?.length > 0) {
      tweetFilter.keywords.forEach(keyword => {
        ruleValue += `${keyword} `;
      })
    }
    if (tweetFilter?.username) {
        ruleValue += `from:${tweetFilter.username} `;
    }
    if (tweetFilter?.hashtag) {
        ruleValue += `#${tweetFilter.hashtag} `;
    }
    if (tweetFilter?.excludeReplies){
        ruleValue += `-is:reply `
    }
    if (tweetFilter?.excludeRetweets){
        ruleValue += `-is:retweet `
    }
    //remove last space
    ruleValue = ruleValue.slice(0, -1);

    if (ruleValue) {
        rules.push({
            value: ruleValue, 
            tag: 'stream filter' 
        })
    }
  
    return rules;
}