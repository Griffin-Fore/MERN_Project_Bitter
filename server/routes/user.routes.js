import {Router} from 'express'
import userController from '../controllers/user.controller.js'

const router = Router()

router.route('/users')
    .get(userController.getAllUsers)
    .post(userController.register)

router.route('/login')
    .post(userController.login)

router.route('/logout')
    .post(userController.logout)

router.route('/users/:id')
    .get(userController.getOneUser)
    .patch(userController.editUser)
    .delete(userController.deleteUser)

export default router;