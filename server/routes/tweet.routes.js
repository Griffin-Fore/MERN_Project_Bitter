import {Router} from 'express';
import tweetController from '../controllers/tweet.controller.js';

const router = Router()

router.route('/tweets')
    .get(tweetController.getAllTweets)
    .post(tweetController.createTweet)

router.route('/tweets/:id')
    .get(tweetController.getOneTweet)
    .patch(tweetController.editTweet)
    .delete(tweetController.deleteTweet)

export default router;