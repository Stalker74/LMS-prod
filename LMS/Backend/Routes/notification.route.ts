import express from 'express'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
import { Get_Notifications, Update_Notification, Delete_Notification } from '../Controller/notification.controller.js'
const router = express.Router()
import cron from 'node-cron'
import { NotificationModel } from '../Model/notification.model.js'

router.route('/get').get(Verify_User,Get_Notifications)
router.route('/update/:id').get(Verify_User,Update_Notification)
router.route('/delete/:id').delete(Verify_User,Delete_Notification)

export default router
