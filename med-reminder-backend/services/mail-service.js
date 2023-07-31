const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();
const logger = require('./logger');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "helpmedreminder@gmail.com",
        pass: "aapfoxwzlvodxsks"
    },
    
});

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
