import { TweetFilter } from '../api/model/tweet-filter.model';
import TwitterRequest from '../util/twitter-request';
import config from '../config/config';
import { TweetPageRequest } from '../api/model/tweet-page-request';
import { TwitterUser } from '../twitter/model/twitter-user';
import { ApiError } from '../api/common/api-error';
import { TweetPageResponseCollection } from '../api/model/tweet-page-response-collection';
import { Tweet } from '../api/model/tweet.model';
import * as request from 'request';

class TweetRepository {

  static findUser(userId: number, username?: string): Promise<TwitterUser> {
    return new Promise<TwitterUser>((resolve, reject) => {
      const options = {
        url: username ? 
            `${config.twitterApi.endpoint}/${config.twitterApi.version}/users/by/username/${username}` :
            `${config.twitterApi.endpoint}/${config.twitterApi.version}/users/${userId}`,
        json: true,
        strictSSL: false
      };
      TwitterRequest.get(options, function (err: any, res: any, body: any) {
        if (err) {
          reject(err)
        } else {
          if (body.data) {
            resolve(body.data);
          } else {
            const err: ApiError = {
              code: 'TSERR002',
              message: `Error retrieving user by ${username ? 'username' : 'id'}: ${username || userId}`
            };
            reject(err);
          }
        }
      })
    });
  }

  static findUserTweets(user: TwitterUser, tweetFilter: TweetFilter, pageRequest: TweetPageRequest): Promise<TweetPageResponseCollection> {
    return new Promise<TweetPageResponseCollection>((resolve, reject) => {
      const options = {
        url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/users/${user.id}/tweets`,
        qs: getUserTweetsQueryString(tweetFilter, pageRequest),
        json: true,
        strictSSL: false
      };
      TwitterRequest.get(options, function (err: any, res: any, body: any) {
        if (err) {
          reject(err)
        } else {
          if (body.data || body.meta)  {
            const models = Tweet.adaptAllApiEntities(body.data, user.username).filter(model => 
              ((!tweetFilter.excludeReplies || (tweetFilter.excludeReplies && !model.isReply)) && 
              (!tweetFilter.excludeRetweets || (tweetFilter.excludeRetweets && !model.isRetweet))) ? true : false
            );
            resolve({
              numResults: body.data ? body.data.length : body.meta.result_count,
              data: body.data ? models : [],
              nextPageToken: body.meta ? body.meta.next_token : null
            });
          } else {
            const err: ApiError = {
              code: 'TSERR003',
              message: `Error retrieving user @${user.username} tweets`
            };
            reject(err);
          }
        }
      })
    });
  }

  static findRecentTweets(tweetFilter: TweetFilter, pageRequest: TweetPageRequest): Promise<TweetPageResponseCollection> {
    return new Promise<TweetPageResponseCollection>((resolve, reject) => {
      const options = {
        url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/tweets/search/recent`,
        qs: getRecentTweetsQueryString(tweetFilter, pageRequest),
        json: true,
        strictSSL: false
      };
      TwitterRequest.get(options, function (err: any, res: any, body: any) {
        if (err) {
          reject(err)
        } else {
          if (body.data || body.meta)  {
            resolve({
              numResults: body.data ? body.data.length : body.meta.result_count,
              data: body.data ? Tweet.adaptAllApiEntities(body.data, null, body.includes) : [],
              nextPageToken: body.meta ? body.meta.next_token : null
            });
          } else {
            const err: ApiError = {
              code: 'TSERR004',
              message: `Error retrieving recent tweets`
            };
            reject(err);
          }
        }
      })
    });
  }

  static getFilteredStream(): Promise<request.Request> {
    return new Promise<request.Request>((resolve, reject) => {
      const options = {
          url: `${config.twitterApi.endpoint}/${config.twitterApi.version}/tweets/search/stream`,
          qs: {
            'expansions': 'author_id',
            'user.fields': 'username,name',
            'tweet.fields': 'created_at,public_metrics,source,referenced_tweets'
          },
          headers: {
            Authorization: `Bearer ${config.twitterApi.accessToken}`
          },
          timeout: config.twitterApi.streamTimeout
      };
      try {
        const streamRequest: request.Request = request.get(options);
        resolve(streamRequest);
      } catch (e) {
        const err: ApiError = {
          code: 'TSERR008',
          message: `Error listening recent tweets`
        };
        reject(err);
      }
    });
  }

}

export default TweetRepository;

// Aux methods
const getUserTweetsQueryString = (tweetFilter: TweetFilter, pageConfig: TweetPageRequest) => {
  // Base object
  const entityQs: any = {
    'max_results': config.twitterApi.maxResultsByRequest,
    'expansions': 'author_id',
    'user.fields': 'username,name',
    'tweet.fields': 'created_at,public_metrics,source,referenced_tweets'
  };

  // Page
  if (pageConfig) {
    entityQs.max_results = pageConfig.numResults;
    if (pageConfig.requestedPageToken) entityQs.pagination_token = pageConfig.requestedPageToken;
  }

  // Dates
  if (tweetFilter?.startDate) entityQs.start_time = tweetFilter.endDate;
  if (tweetFilter?.endDate) entityQs.end_time = tweetFilter.endDate;

  return entityQs;
}

const getRecentTweetsQueryString = (tweetFilter: TweetFilter, pageConfig?: TweetPageRequest) => {
  // Base object
  const entityQs: any = {
    'max_results': config.twitterApi.maxResultsByRequest,
    'expansions': 'author_id',
    'user.fields': 'username,name',
    'tweet.fields': 'created_at,public_metrics,source,referenced_tweets'
  };

  // Page
  if (pageConfig) {
    entityQs.max_results = pageConfig.numResults;
  }

  // Dates
  if (tweetFilter?.startDate) entityQs.start_time = tweetFilter.endDate;
  if (tweetFilter?.endDate) entityQs.end_time = tweetFilter.endDate;

  // Query related
  if (tweetFilter?.keywords || tweetFilter?.username || tweetFilter?.hashtag) {
    entityQs.query = '';
  }
  if (tweetFilter?.keywords?.length > 0) {
    tweetFilter.keywords.forEach(keyword => {
      entityQs.query += `${keyword} `;
    })
  }
  if (tweetFilter?.username) {
    entityQs.query += `from:${tweetFilter.username} `;
  }
  if (tweetFilter?.hashtag) {
    entityQs.query += `#${tweetFilter.hashtag} `;
  }
  if (tweetFilter?.excludeReplies){
    entityQs.query += `-is:reply `
  }
  if (tweetFilter?.excludeRetweets){
    entityQs.query += `-is:retweet `
  }
  //remove last space
  entityQs.query = entityQs.query.slice(0, -1);

  return entityQs;
}