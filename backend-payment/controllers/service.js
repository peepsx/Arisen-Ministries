"use strict"
const promise = require('promise');
// const config = require('../config');
const { reject } = require('promise');
// const nodemailer = require("nodemailer");
var fs = require('fs');
const ejs = require("ejs");
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.API_KEY_ID);



// Create a SMTP transporter object
// let transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:'kumarujjawal786@gmail.com',
//         pass:'9431627625'
//     }
// });

class Service {
    constructor() { }





   

    sendmail(data) {

        return new promise((resolve, reject) => {

            ejs.renderFile(__dirname + "/views/donateemail.ejs" ,{
                user_firstname: data.fName,
              }, function (err, datas) {
                if (err) {
                    console.log(err);
                } else {
                    const email = {
                        to: data.email,
                        from: 'noreply@arisen.church',
                        subject: data.subject,
                        html: datas
                    }
                    // console.log("html data ======================>", mainOptions.html);

                    sendgrid.send(email, function (err, info) {
                        if (err) {
                            console.log('====>>>>>>>>>>', err)
                            resolve(false)
                        } else {
                            console.log('success', info)
                            resolve(info)
                        }
                    });
                }
            });
        })
    }


    sendmailjoin(data) {

        return new promise((resolve, reject) => {

            ejs.renderFile(__dirname + "/views/joinemail.ejs" ,{
                user_firstname: data.fName,
              }, function (err, datas) {
                if (err) {
                    console.log(err);
                } else {
                    const email = {
                        to: data.email,
                        from: 'noreply@arisen.church',
                        subject: data.subject,
                        html: datas
                    }
                    // console.log("html data ======================>", mainOptions.html);

                    sendgrid.send(email, function (err, info) {
                        if (err) {
                            console.log('====>>>>>>>>>>', err)
                            resolve(false)
                        } else {
                            console.log('success', info)
                            resolve(info)
                        }
                    });
                }
            });
        })
    }


}

module.exports = new Service();