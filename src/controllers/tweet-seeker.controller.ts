import { ApiError } from "../api/common/api-error";
import { TweetManager } from "../twitter/tweet-manager";

class TweetSeekerController {

    /**
     * Get user tweets
     * @param req includes search filter in req.body and optionally page config
     * @param res returns the user tweets 
     */
    public static getUserTweets = function (req: any, res: any) {
        if (req.body?.filter && req.body?.pagination && req.body?.broadcastId){
            TweetManager.searchUserTweets(req.body.broadcastId, req.body.filter, req.body.pagination).then(data => {
                res.status(200).json(data)
            }).catch(err => res.status(500).json(err))
        } else {
            const err: ApiError = {
                code: 'TSERR006',
                message: 'The request is incomplete',
            };
            res.status(405).json(err);
        }
    };

    /**
     * Search latest tweets
     * @param req includes search filter in req.body
     * @param res returns the latest tweets
     */
    public static searchTweets = function (req: any, res: any) {
        if (req.body?.filter && req.body?.broadcastId){
            TweetManager.searchLatest(req.body.broadcastId, req.body.filter, req.body.pagination).then(data => {
                res.status(200).json(data)
            }).catch(err => res.status(500).json(err))
        } else {
            const err: ApiError = {
                code: 'TSERR006',
                message: 'The request is incomplete',
            };
            res.status(405).json(err);
        }
    };

    /**
     * Listen tweets
     * @param req includes search filter in req.body
     * @param res returns success message when stream reading is initialized, otherwise returns error
     */
    public static listenTweets = function (req: any, res: any) {
        if (req.body?.filter && req.body?.broadcastId){
            TweetManager.listenTweets(req.body.broadcastId, req.body.filter).then(_ => {
                res.status(200).json({status : 'OK'})
            }).catch(err => res.status(500).json(err))
        } else {
            const err: ApiError = {
                code: 'TSERR006',
                message: 'The request is incomplete',
            };
            res.status(405).json(err);
        }
    };

}

export default TweetSeekerController;
