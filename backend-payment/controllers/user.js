const Userpayment = require('../modals/user')
// const config = require('../config')
const service = require('./service');
const Payment = require('../modals/payment')
const Paypalpayment = require('../modals/paypalpayment')
const Cardonetimepayment = require('../modals/onetimepayment')
const Paypalonetimepayment = require('../modals/paypalonetimepayment')
const { validationResult } = require('express-validator')
const ejs = require("ejs");



const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const payPalClient = require("../paypalclient");


const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.API_KEY_ID);



class Users {
    // userpayment(req, res) {
    //     const { name, token, amount } = req.body;
    //     console.log('req.body stripe subscription', req.body)
    //     service.createSubcription(name, token).then(resultData => {
    //         if (resultData) {
    //             Payment.find().then((response) => {
    //                 let paymentObject = new Payment({
    //                     name: name,
    //                     token: token,
    //                     subscriptionId: resultData.id,
    //                     amount: 5,
    //                     created: resultData.created
    //                 })
    //                 paymentObject.save().then((respData) => {
    //                     res.json({ status: true, message: "Payment successful.", data: resultData })

    //                 }).catch((error) => {
    //                     console.log(error)
    //                 })

    //             }).catch((error2) => {
    //                 console.log(error2)
    //             })
    //         }
    //     }).catch((error1) => {
    //         if (error1.Error) {
    //             res.status(501).json({ status: false, message: error1.Error })
    //         } else if (error1.raw.message) {
    //             res.status(501).json({ status: false, message: error1.raw.message })
    //         } else {
    //             res.json({ "status": false, "message": "Internal server error.", "data": error })
    //         }
    //     })
    // }

    saveuser(req, res) {
        const errorss = validationResult(req);
        if (!errorss.isEmpty()) {
            console.log("errors on data save", errorss);
            //  errorss.array().map(element => {
            //         return res.status(201).json({ status: false, message: element.msg })
            //     }).join(',')
        }
        else {
            const { fName, lName, addressOne, addressTwo, city, state, zipcode, phoneNo, email, subscriptionId, subscriptionStatus } = req.body
            Paypalpayment.findOne({ subscriptionID: subscriptionId }).then((response) => {

                let request = new checkoutNodeJssdk.orders.OrdersGetRequest(response.orderID);

                payPalClient.client().execute(request).then((respo) => {

                    if (respo.result.status == 'APPROVED') {
                        Userpayment.findOne({ email: email }).then((resp) => {
                            if (resp) {
                                return res.status(201).json({ status: false, message: "User already subscribed" })
                            } else {
                                console.log('inside findone elsecase', req.body)
                                let userObject = new Userpayment({
                                    fName: fName,
                                    lName: lName,
                                    addressOne: addressOne,
                                    addressTwo: addressTwo,
                                    city: city,
                                    state: state,
                                    zipcode: zipcode,
                                    // country: country,
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
                                    console.log("response from paypal", result)
                                    if (result) {
                                        userObject.save().then(doc => {
                                            res.json({ status: true, message: "Congratulations, You are peeps member now. Kindly Please check your Email" })
                                        }).catch((error) => {
                                            console.log(error)
                                            res.json({ "status": false, "message": "Internal server error.", "data": error })
                                        })
                                    }
                                }).catch((e) => {
                                    console.log("response from exception", e)
                                })
                            }
                        }).catch((err) => {
                            console.log('=========', err)
                        })
                    }
                    else {
                        res.json({ "status": false, "message": "PayPal Payment not Approved" })
                    }

                }).catch((exc) => {
                    console.log("exc", exc);

                    res.json({ "status": false, "message": "PayPal Payment not valid" })
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
        const { amount, transectionId, paymentStatus, fname, lname, email, addressOne, addressTwo, city, state, zipcode, country } = req.body
        console.log('=========onetime', amount, transectionId, paymentStatus, fname, lname, email, addressOne, addressTwo, city, state, zipcode, country)
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
                            addressTwo: addressTwo,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                            country: country
                        })
                        paypalOneTimePaymentObj.save().then((docsres) => {
                            if (docsres) {
                                console.log('docsres======>',docsres)

                                let object = {};
                                object.email = email;
                                object.subject = "Arisen Church | Thank You For Your Donation!",
                                    object.fName = fname
                                service.sendmail(object).then((result) => {
                                    console.log("response from paypal", result)
                                    res.json({ status: true, message: "Data saved" })

                                }).catch((e) => {
                                    console.log("response from exception", e)
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
        }).catch((e) => {
            console.log("exception", e)
        })
    }





    // cardonetimepayment(req, res) {

    //     // const errors = validationResult(req);
    //     // if (!errorss.isEmpty()) {
    //     //     console.log('error======validation',errors)
    //     //     return res.status(201).json({ status: false, message: "Validation Error", Error: errors })
    //     // } else {

    //     const { amount, token, fname, lname, email, addressOne, addressTwo, city, state, zipcode, country } = req.body
    //     console.log('req.body', req.body)
    //     service.onetimepayment(amount, token).then((resultdata) => {
    //         console.log('cardpayment', resultdata.id, resultdata.amount, resultdata.balance_transaction, resultdata.paid, resultdata.status)
    //         if (resultdata) {
    //             Cardonetimepayment.find().then((resp) => {
    //                 let cardOneTimePaymentObj = new Cardonetimepayment({
    //                     amount: amount,
    //                     subscriptionId: resultdata.id,
    //                     transectionId: resultdata.balance_transaction,
    //                     paid: resultdata.paid,
    //                     paymentStatus: resultdata.status,
    //                     fname: fname,
    //                     lname: lname,
    //                     email: email,
    //                     addressOne: addressOne,
    //                     addressTwo: addressTwo,
    //                     city: city,
    //                     state: state,
    //                     zipcode: zipcode,
    //                     country: country
    //                 })
    //                 cardOneTimePaymentObj.save().then((respdata) => {
    //                     if (respdata) {
    //                         res.json({ status: true, message: "Payment successful.", data: resultdata })
    //                     } else {
    //                         res.json({ status: false, message: "Data not saved." })
    //                     }
    //                 }).catch(errss => {
    //                     console.log(errss)
    //                 })
    //             }).catch(ers => {
    //                 console.log(ers)
    //             })
    //         } else {
    //             res.json({ status: false, message: "Payment failed,Try again." })
    //         }
    //     }).catch((err) => {
    //         console.log('catch block onetimepayment', err)
    //         res.json({ status: false, message: "Payment failed,Try again.", error: err })
    //     })
    //     // }
    // }


    // async totalamount(req, res) {
    //     try {
    //         let one_t_payment = await Cardonetimepayment.aggregate([
    //             {
    //                 $group: {
    //                     _id: null,
    //                     "one_t_payment": { $sum: "$amount" },
    //                 }
    //             }
    //         ])
    //         let payment = await Payment.aggregate([
    //             {
    //                 $group: {
    //                     _id: null,
    //                     "payment": { $sum: "$amount" },
    //                 }
    //             }
    //         ])

    //         let pay_pal_payment = await Paypalpayment.aggregate([
    //             {
    //                 $group: {
    //                     _id: null,
    //                     "pay_pal_payment": { $sum: "$amount" },
    //                 }
    //             }
    //         ])

    //         let pay_one_payment = await Paypalonetimepayment.aggregate([
    //             {
    //                 $group: {
    //                     _id: null,
    //                     "pay_one_payment": { $sum: "$amount" },
    //                 }
    //             }
    //         ])
    //         let total_amount = one_t_payment[0].one_t_payment + pay_one_payment[0].pay_one_payment + pay_pal_payment[0].pay_pal_payment + payment[0].payment;
    //         res.status(200).json({ success: true, total: total_amount });
    //     }
    //     catch (exception) {
    //         res.status(200).json({ success: false, total: 0 });


    //     }
    // }




    // sendmail(req, res) {


    // ejs.renderFile(__dirname + "/views/emailtemplate.ejs", function (err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         const email = {
    //             to: 'mku6818@gmail.com',
    //             from: 'noreply@peepsx.com',
    //             subject: 'My first email',
    //             // text: 'Hello world',
    //             html: data
    //         }
    //         // console.log("html data ======================>", mainOptions.html);

    //         sendgrid.send(email, function (err, info) {
    //             if (err) {
    //                 console.log('====>>>>>>>>>>', err)
    //                 res.json({
    //                     msg: 'fail'
    //                 })
    //             } else {
    //                 console.log('success')
    //                 res.json({
    //                     msg: 'success'
    //                 })
    //             }
    //         });
    //     }
    // });

    // const email = {
    //     to: 'mku6818@gmail.com',
    //     from: 'noreply@peepsx.com',
    //     subject: 'My first email',
    //     text: 'Hello world',
    // }
    // sendgrid.send(email).then((docss)=>{
    //     if(docss){
    //         console.log('sendgridsuccess',docss)
    //         res.json({status:true,message:"mail sent",data:docss})
    //     }else{
    //         console.log('sendgrid else')
    //         res.json({status:false,message:"mail sent"})
    //     }
    // }).catch((errr)=>{
    //     console.log('sendgrid catch block',errr)
    // })

    // }


}

module.exports = new Users()