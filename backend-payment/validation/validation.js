const { check } = require('express-validator');

class Validation {

    constructor() { }


    validate(params) {
        console.log('params=====>>>>>>>>', params)
        switch (params) {

            case "stripePayment":
                return [
                    check('name')
                        .notEmpty()
                        .withMessage('Enter Your name')
                        .isString()
                        .withMessage('Enter correct name')
                        .trim(),
                    check('token')
                        .notEmpty()
                        .withMessage('Enter Your stripe token')
                        .isString()
                        .withMessage('Enter correct stripe token')
                        .trim(),
                ]

            case "paypalPayment":
                return [
                    check('orderID')
                        .notEmpty()
                        .withMessage('Enter paypal orderID')
                        .isString()
                        .withMessage('Enter correct paypal orderID')
                        .trim(),
                    check('billingToken')
                        .notEmpty()
                        .withMessage('Enter paypal billingToken')
                        .isString()
                        .withMessage('Enter correct paypal billingToken')
                        .trim(),
                    check('subscriptionID')
                        .notEmpty()
                        .withMessage('Enter paypal subscriptionID')
                        .isString()
                        .withMessage('Enter correct paypal subscriptionID')
                        .trim(),
                    check('facilitatorAccessToken')
                        .notEmpty()
                        .withMessage('Enter paypal facilitatorAccessToken')
                        .isString()
                        .withMessage('Enter correct paypal facilitatorAccessToken')
                        .trim()
                ]

            case "userDetails":
                return [
                    check('fName')
                        .notEmpty()
                        .withMessage('Enter your first name')
                        .isString()
                        .withMessage('Enter correct first name')
                        .trim(),
                    check('lName')
                        .notEmpty()
                        .withMessage('Enter your last name')
                        .isString()
                        .withMessage('Enter correct last name')
                        .trim(),
                    check('addressOne')
                        .notEmpty()
                        .withMessage('Enter your first address')
                        .isString()
                        .withMessage('Enter correct first address')
                        .trim(),
                    check('addressTwo')
                        .notEmpty()
                        .withMessage('Enter your second address')
                        .isString()
                        .withMessage('Enter correct second address')
                        .trim(),
                    check('city')
                        .notEmpty()
                        .withMessage('Enter your city name')
                        .isString()
                        .withMessage('Enter correct city name')
                        .trim(),
                    check('state')
                        .notEmpty()
                        .withMessage('Enter your state name')
                        .isString()
                        .withMessage('Enter correct state name')
                        .trim(),
                    check('zipcode')
                        .notEmpty()
                        .withMessage('Enter your zipcode')
                        .isNumeric()
                        .withMessage('Enter correct zipcode')
                        .trim(),
                    // check('country')
                    //     .notEmpty()
                    //     .withMessage('Enter your country name')
                    //     .isString()
                    //     .withMessage('Enter correct country name')
                    //     .trim(),
                    check('phoneNo')
                        .notEmpty()
                        .withMessage('Enter your phone number')
                        .isNumeric()
                        .withMessage('Enter correct phone number')
                        .trim(),
                    check('email')
                        .notEmpty()
                        .withMessage('Enter your email')
                        .isEmail()
                        .withMessage('Enter correct email')
                        .trim(),
                    check('paymenttype')
                        .notEmpty()
                        .withMessage('Enter your paymenttype,Either is by Stripe or Paypal')
                        .isString()
                        .withMessage('Enter correct paymenttype')
                        .trim(),
                    check('subscriptionId')
                        .notEmpty()
                        .withMessage('Enter your subscriptionId')
                        .isString()
                        .withMessage('Enter correct subscriptionId')
                        .trim(),
                    check('subscriptionStatus')
                        .notEmpty()
                        .withMessage('Enter your subscriptionStatus, Either it is active or inactive')
                        .isString()
                        .withMessage('Enter correct subscriptionStatus ')
                        .trim()
                ]

            case "cardonetimepayment":
                return [
                    check('amount')
                        .notEmpty()
                        .withMessage('Enter your donation amount')
                        .isNumeric()
                        .withMessage('Enter Valid donation amount')
                        .trim(),
                    check('subscriptionId')
                        .notEmpty()
                        .withMessage('Enter your subscriptionId')
                        .isString()
                        .withMessage('Enter valid subscriptionId')
                        .trim(),
                    check('transectionId')
                        .notEmpty()
                        .withMessage('Enter your transectionId')
                        .isString()
                        .withMessage('Enter valid transectionId'),
                    check('paid')
                        .notEmpty()
                        .withMessage('Enter paid status'),
                    check('paymentStatus')
                        .notEmpty()
                        .withMessage('Enter payment status'),
                    check('fname')
                        .notEmpty()
                        .withMessage('Enter your first name')
                        .isString()
                        .withMessage('Enter valid first name')
                        .trim(),
                    check('lname')
                        .notEmpty()
                        .withMessage('Enter your last name')
                        .isString()
                        .withMessage('Enter valid last name')
                        .trim(),
                    check('email')
                        .notEmpty()
                        .withMessage('Enter your email')
                        .isEmail()
                        .withMessage('Enter valid email')
                        .trim(),
                    check('addressOne')
                        .notEmpty()
                        .withMessage('Enter your first address')
                        .isString()
                        .withMessage('Enter valid first address')
                        .trim(),
                    check('addressTwo')
                        .notEmpty()
                        .withMessage('Enter your second address')
                        .isString()
                        .withMessage('Enter valid second address')
                        .trim(),
                    check('city')
                        .notEmpty()
                        .withMessage('Enter your city name')
                        .isString()
                        .withMessage('Enter valid city name')
                        .trim(),
                    check('state')
                        .notEmpty()
                        .withMessage('Enter your state name')
                        .isString()
                        .withMessage('Enter valid state name')
                        .trim(),
                    check('zipcode')
                        .notEmpty()
                        .withMessage('Enter your zipcode')
                        .isNumeric()
                        .withMessage('Enter valid zipcode')
                        .trim(),
                    check('country')
                        .notEmpty()
                        .withMessage('Enter your country name')
                        .isString()
                        .withMessage('Enter valid country name')
                        .trim(),


                ]


        }

    }
}

module.exports = new Validation();