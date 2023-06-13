const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();
const logger = require('./logger');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_ID,
//     pass: Process.env.EMAIL_PASS // naturally, replace both with your real credentials or an application-specific password
//   }
// });

// const mailOptions = {
//   from: process.env.EMAIL_ID,
//   to: req.body.email,
//   subject: 'Email Verification',
//   text: 'Dudes, we really need your money.'
// };

// var sendMail = transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
// 	console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "helpmedreminder@gmail.com",
        pass: "aapfoxwzlvodxsks"
    },
    
});

// transporter.use('compile', hbs({
//   viewEngine: 'express-handlebars',
//   viewPath: './views'
// }));

let sendMail = (mailOptions)=>{
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logger.error(error);
        return console.log(error);
    }
    else {
        console.log('Email sent: ' + info.response);
        logger.info(`Email sent:  ${info.response}`);
    }
  });
};

module.exports = sendMail;
