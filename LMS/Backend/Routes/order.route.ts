import express from 'express'
import { Create_Order, Get_All_Orders } from '../Controller/order.controller.js'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
const router = express.Router()

router.route('/create').post(Verify_User,Create_Order)
router.route('/get-all-orders').get(Verify_User,Get_All_Orders)


export default router