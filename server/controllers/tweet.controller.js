import Tweet from "../models/tweet.model.js";

const tweetController = {
    getAllTweets: async (req, res) => {
        try {
            const allTweets = await Tweet.find();
            res.json(allTweets)
        } catch (err) {
            console.log("getAllTweets catch err: ",err)
            res.status(400).json(err)
        }
    },
    createTweet: async (req, res) => {
        try {
            const newTweet = await Tweet.create(req.body)
            res.json(newTweet)
        } catch (err) {
            console.log("createTweet catch err: ", err)
            res.status(400).json(err)
        }
    },
    getOneTweet: async (req, res) => {
        try {
            const selectedTweet = await Tweet.findById(req.params.id);
            res.json(selectedTweet)
        } catch (err) {
            console.log("getOneTweet catch err: ", err)
            res.status(400).json(err)
        }
    },
    editTweet: async (req, res) => {
        const options = {
            new: true,
            runValidators: true
        };
        try {
            const editedTweet = await Tweet.findByIdAndUpdate(req.params.id, req.body, options)
            res.json(editedTweet)
        } catch (err) {
            console.log("editTweet catch err: ", err)
            res.status(400).json(err)
        }
    },
    deleteTweet: async (req, res) => {
        try {
            const deletedTweet = await Tweet.findByIdAndDelete(req.params.id)
            res.json(deletedTweet)
        } catch (err) {
            console.log("deleteTweet catch err")
            res.status(400).json(err)
        }
    }
}

export default tweetController