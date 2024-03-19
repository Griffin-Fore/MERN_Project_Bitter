import {model, Schema } from 'mongoose';

const CommentSchema = new Schema({
    parent_comment_id: {
        type: String
    },
    user_id: {
        type: String,
        required: [true, "User ID is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    user_image_url: {
        type: String,
        required: [true, "User image is required"]
    },
    tweet_id: {
        type: String,
        required: [true, "Tweet ID is required"]
    },
    text_content: {
        type: String,
        required: [true, "Must provide text"],
        maxLength: [1000, "Text must not be more than 1000 characters long"]
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
    users_who_liked_this_comment: {
        type: [String]
    },
    likes_count: {
        type: Number,
        default: 0
    },
    users_who_disliked_this_comment: {
        type: [String]
    },
    dislikes_count: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const Comment = model("Comment", CommentSchema)
export default Comment