import {Router} from 'express';
import commentController from '../controllers/comment.controller.js';

const router = Router()

router.route('/comments')
    .get(commentController.getAllComments)
    .post(commentController.createComment)

router.route('/comments/:id')
    .get(commentController.getOneComment)
    .patch(commentController.editComment)
    .delete(commentController.deleteComment)

export default router