const express = require('express');
const router = express.Router();
const controller = require('../controllers/user')
const validation =require('../validation/validation')


/* GET users listing. */
// router.post('/payment',validation.validate('stripePayment'),controller.userpayment );
router.post('/saveuser',validation.validate('userDetails'),controller.saveuser);
router.post('/paypalpayment',validation.validate('paypalPayment'),controller.paypalpayment);
// router.post('/onetimepayment',validation.validate('cardonetimepayment'),controller.cardonetimepayment)
router.post('/paypalonetimepayment',controller.paypalonetimepayment)
// router.get('/amount', controller.totalamount)
// router.post('/sendemail',controller.sendmail)


module.exports = router;
