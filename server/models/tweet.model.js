import {model, Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const TweetSchema = new Schema({
    user_id: {
        type: String,
        required: [true, "user_id is required"]
    },
    username: {
        type: String,
        required: [true, "username is required"]
    },
    user_image_url: {
        type: String,
        required: [true, "user_image_url is required"]
    },
    text_content: {
        type: String,
        required: [true, "text is required"],
        maxLength: [1000, "Tweet cannot exceed 1000 characters"]
    },
    image_url_one: {
        type: String
    },
    image_url_two: {
        type: String
    },
    image_url_three: {
        type: String
    },
    image_url_four: {
        type: String
    },
    users_that_liked_this_tweet: {
        type: [String]
    },
    likes_count: {
        type: Number
    },
    users_that_disliked_this_tweet: {
        type: [String]
    },
    dislikes_count: {
        type: Number
    },
    users_that_retweeted_this_tweet: {
        type: [String]
    },
    retweets_count: {
        type: Number
    },
    comment_IDs: {
        type: [String]
    },
    comments_count: {
        type: Number
    }
}, {timestamps: true})

const Tweet = model("Tweet", TweetSchema)

export default Tweet