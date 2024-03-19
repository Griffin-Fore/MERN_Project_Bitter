import Comment from "../models/comment.model.js"

const commentController = {
    getAllComments: async (req, res) => {
        try {
            const allComments = await Comment.find()
            res.json(allComments)
        } catch (err) {
            console.log("commentController getAllComments catch err: ", err)
            res.status(400).json(err)
        }
    },
    createComment: async (req, res) => {
        try {
            const newComment = await Comment.create(req.body)
            res.json(newComment)
        } catch (err) {
            console.log("commentController createComment catch err: ", err)
            res.status(400).json(err)
        }
    },
    getOneComment: async (req, res) => {
        try {
            const selectedComment = await Comment.findById(req.params.id);
            res.json(selectedComment)
        } catch (err) {
            console.log("commentController getOneComment catch err: ", err)
            res.status(400).json(err)
        } 
    },
    editComment: async (req, res) => {
        const options = {
            new: true,
            runValidators: true
        };
        try {
            const editedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, options)
            res.json(editedComment)
        } catch (err) {
            console.log("commentController editComment catch err: ", err)
            res.status(400).json(err)
        }
    },
    deleteComment: async (req, res) => {
        try {
            const deletedComment = await Comment.findByIdAndDelete(req.params.id)
            res.json(deletedComment)
        } catch (err) {
            console.log("commentController deleteComment catch err: ", err)
            res.status(400).json(err)
        }
    }
}

export default commentController