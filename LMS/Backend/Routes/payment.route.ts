import express from 'express'
import { SessionVerification, StripeCheckoutSession } from '../Controller/payment.controller.js'
const router  = express.Router()

router.route('/create-checkout-session').post(StripeCheckoutSession)
router.route('/verification').post(SessionVerification)



export default router