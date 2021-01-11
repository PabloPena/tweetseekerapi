/**
 * Define express app routes
 */


/**
 * Module dependencies.
 */
import express from 'express';
import tweetSeekerController from './controllers/tweet-seeker.controller';
import indexController from './controllers/index.controller';


const router = express.Router();

/* Routes */
router.route('/api/v2').get(indexController.index);
router.route('/api/v2/tweet/user/tweets').post(tweetSeekerController.getUserTweets);
router.route('/api/v2/tweet/search').post(tweetSeekerController.searchTweets);
router.route('/api/v2/tweet/listen').post(tweetSeekerController.listenTweets);

export default router;