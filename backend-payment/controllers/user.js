const Userpayment = require('../modals/user')
// const config = require('../config')
const service = require('./service');
const Payment = require('../modals/payment')
const Paypalpayment = require('../modals/paypalpayment')
const Cardonetimepayment = require('../modals/onetimepayment')
const Paypalonetimepayment = require('../modals/paypalonetimepayment')
const { validationResult } = require('express-validator')
var request = require('superagent');
const ejs = require("ejs");



const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const payPalClient = require("../paypalclient");


const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.API_KEY_ID);

//const sendgrid = require("@sendgrid/mail")(process.env.API_KEY_ID);




class Users {

    sendmail(req, res) {
        const { email } = req.body
        var mailchimpInstance = process.env.MAILCHIMPINSTANCE,
            listUniqueId = process.env.MAILCHIMPLISTUNIQUEID,
            mailchimpApiKey = process.env.MAILCHIMPAPIKEY;
        request
            .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
            .set('Content-Type', 'application/json;charset=utf-8')
            .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
            .send({
                'email_address': email,
                'status': 'subscribed',
            })
            .end(function (err, response) {
                console.log('=========>res', response.body)
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {

                    return res.json({ status: true, message: 'Mail subscibed', data: response.body });
                } else {
                    return res.json({ status: false, message: 'Mail not subscibed', data: response.body });
                }
            });

    }

    saveuser(req, res) {
        const errorss = validationResult(req);
        if (!errorss.isEmpty()) {
            console.log("errors on data save", errorss);
            return res.status(201).json({ status: false, message: "Either You have not done the Subsciption or fields are missing" })
            //  errorss.array().map(element => {
            //         return res.status(201).json({ status: false, message: element.msg })
            //     }).join(',')
        }
        else {
            const { fName, lName, addressOne, city, state, zipcode, phoneNo, email, subscriptionId, subscriptionStatus } = req.body
            Paypalpayment.findOne({ subscriptionID: subscriptionId }).then((response) => {

                let request = new checkoutNodeJssdk.orders.OrdersGetRequest(response.orderID);

                payPalClient.client().execute(request).then((respo) => {

                    if (respo.result.status == 'APPROVED') {
                        Userpayment.findOne({ email: email }).then((resp) => {
                            if (resp) {
                                return res.status(201).json({ status: false, message: "User already subscribed with current EmailID" })
                            } else {
                                console.log('inside findone elsecase', req.body)
                                let userObject = new Userpayment({
                                    fName: fName,
                                    lName: lName,
                                    addressOne: addressOne,
                                    city: city,
                                    state: state,
                                    zipcode: zipcode,
                                    phoneNo: phoneNo,
                                    email: email,
                                    subscriptionId: subscriptionId,
                                    subscriptionStatus: subscriptionStatus
                                });
                                let object = {};
                                object.email = email;
                                object.subject = "Welcome To I AM Freedom!",
                                    object.fName = fName
                                service.sendmailjoin(object).then((result) => {
                                    console.log("response from sendgrid", result)
                                    if (result) {
                                        userObject.save().then(doc => {
                                            res.json({ status: true, message: "Congratulations, You are now an Arisen church member. Kindly Please check your Email" })
                                        }).catch((error) => {
                                            console.log(error)
                                            res.json({ "status": false, message: "Internal server error.", data: error })
                                        })
                                    }
                                }).catch((e) => {
                                    console.log("response from exception", e)
                                    res.json({ "status": false, message: "Email Not Sent Try later.", data: error })
                                })
                            }
                        }).catch((err) => {
                            console.log('=========', err)
                        })
                    }
                    else {
                        res.json({ status: false, message: "PayPal Payment not Approved" })
                    }

                }).catch((exc) => {
                    console.log("exc", exc);

                    res.json({ status: false, message: "PayPal Payment not valid" })
                })

            }).catch((exception) => {
                console.log("exception in paypal finding in save user", exception);
            })
        }
    }

    paypalpayment(req, res) {
        const errorss = validationResult(req);
        if (!errorss.isEmpty()) {
            return res.status(201).json({ status: false, message: "Please Do the payment via paypal" })
        }
        else {
            const { orderID, billingToken, subscriptionID, facilitatorAccessToken, } = req.body
            Paypalpayment.findOne({ subscriptionID: subscriptionID })
                .then((docs) => {
                    if (docs) {
                        return res.json({ status: false, message: 'Already paypal subscriptionID exist' })
                    }
                    else {

                        let paypalpaymentObj = new Paypalpayment({
                            orderID: orderID,
                            billingToken: billingToken,
                            subscriptionID: subscriptionID,
                            amount: 19.99,
                            facilitatorAccessToken: facilitatorAccessToken
                        });
                        paypalpaymentObj.save()
                            .then((docsResult) => {
                                if (docsResult) {
                                    return res.json({ status: true, message: 'Data saved successfully' })
                                } else {
                                    return res.json({ status: false, message: 'Data not saved,try again' })
                                }
                            })
                            .catch((errs) => {
                                console.log(errs)
                            })

                    }
                })
                .catch((errors) => {
                    console.log(errors)
                })
        }
    }

    // paypal onetime payment


    paypalonetimepayment(req, res) {
        const { amount, transectionId, paymentStatus, fname, lname, email, addressOne, city, state, zipcode, country } = req.body
        console.log('=========onetime', amount, transectionId, paymentStatus, fname, lname, email, addressOne, city, state, zipcode, country)
        let request = new checkoutNodeJssdk.orders.OrdersGetRequest(transectionId);

        payPalClient.client().execute(request).then((respo) => {
            if (respo.result.status == 'COMPLETED') {
                Paypalonetimepayment.findOne({ transectionId: transectionId }).then((resps) => {
                    if (resps) {
                        res.json({ status: false, message: "TransectionId already used,Try again." })
                    } else {
                        let paypalOneTimePaymentObj = new Paypalonetimepayment({
                            amount: amount,
                            transectionId: transectionId,
                            paymentStatus: paymentStatus,
                            fname: fname,
                            lname: lname,
                            email: email,
                            addressOne: addressOne,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                            country: country
                        })
                        paypalOneTimePaymentObj.save().then((docsres) => {
                            if (docsres) {
                                console.log('docsres======>', docsres)

                                let object = {};
                                object.email = email;
                                object.subject = "Arisen Church | Thank You For Your Donation!",
                                    object.fName = fname
                                service.sendmail(object).then((result) => {
                                    console.log("response from sendgridd", result)
                                    res.json({ status: true, message: "Thank You for the Donation, Please Check your EmailID" })

                                }).catch((e) => {
                                    console.log("response from exception", e)
                                    res.json({ status: false, message: "Email Not sent, Please try later" })

                                })
                            } else {
                                res.json({ status: false, message: "Data not saved" })
                            }

                        }).catch((errobj) => {
                            console.log('paypalonetimesaveuser====catchblock', errobj)
                        })
                    }
                }).catch((errorses) => {
                    console.log('error', errorses)
                })
            }
            else {
                res.json({ status: false, message: "PayPal Payment not Approved" })
            }
        }).catch((e) => {
            console.log("exception", e)
        })
    }


    getalldonationdetails(req, res) {
        Paypalonetimepayment.find().then((details) => {
            if (details) {
                res.json({ status: true, message: "Data fetched", data: details })
            }
        }).catch((err) => {
            res.json({ status: false, message: "Something went wrong", data: err })
        })

    }



    contactmail(req, res) {
        const { from_email, from_body, from_name } = req.body
        console.log('====', from_email, from_body, from_name)

        // const email = {
        //     to: 'hello@arisen.church',
        //     from: 'noreply@arisen.church',
        //     subject: "sss",
        // }
        let object = {};
        object.email = from_email;
        object.subject = "Response From Contact",
            object.fName = from_name
            object.body = from_body

        service.contactsendmail(object).then((result) => {
            console.log("response from sendgridd", result)
            res.json({ status: true, message: "Thank You for the Response" })

        }).catch((e) => {
            console.log("response from exception", e)
            res.json({ status: false, message: "Email Not sent, Please try later" })

        })


    }
}


module.exports = new Users()