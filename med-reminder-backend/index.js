// const qrcode = require('qrcode-terminal');

// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// client.on('qr', qr => {
//     qrcode.generate(qr, {small: true});
// });


// client.on('ready', () => {
//     console.log('Client is ready!');
   
//      // Number where you want to send the message.
//     const number = "+918514051404";
   
//      // Your message.
//     const text = "Hey Lawra Subho hahaha";
   
//      // Getting chatId from the number.
//      // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
//     const chatId = number.substring(1) + "@c.us";
   
//     // Sending message.
//     client.sendMessage(chatId, text);
//    });

// client.initialize();


const express = require('express')
const  https = require('https')
const http = require('http')
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const logger = require('./services/logger');
const mongo = require('./mongo-client');
const mailer = require('./services/mail-service');
const jwt = require("jsonwebtoken");
const  ObjectId = require('mongodb').ObjectId;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var session = require('express-session');

//---models
const Users = require("./models/Users");
const Medicine = require("./models/medicine-model");

var isLoggedIn = false;


    //Twilio Whtsapp message 
    const accountSid = 'AC79f90dddf66af6f430ca82aabd7fd4a1';
    const authToken = '152f7aba9977675aa23979823ffe001e';
    const client = require('twilio')(accountSid, authToken);

    // client.messages
    //     .create({
    //         body: 'Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/',
    //         from: 'whatsapp:+14155238886',
    //         to: 'whatsapp:+917003946589'
    //     })
    //     .then(message => console.log(message.sid));


    app.use(bodyParser.urlencoded({
        extended: true
    })); 

    app.use(bodyParser.json());

    // cookie parser middleware
    app.use(cookieParser());

    //cors settings creation
    var corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }
    app.use(cors(corsOptions));

    //Mongoose connection 
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://127.0.0.1:27017/medicine-reminder-app");

    //Session creation
    //const oneDay = 1000 * 60 * 60 * 24;
    const oneDay = 1000 * 60;
    app.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: oneDay },
        resave: false 
    }));


    //base location api 
    app.get('/', async (req, res) => {
        try {
            //const user = await Users.find();
            //res.send(user);
            
            console.log(session.cookie._expires);
            if(session.cookie._expires > Date.now())
            {
                isLoggedIn = true;
                res.status(200).send(`Session is alive, ${session.cookie._expires} user ${session.name} logged in successfully. User logged in --> ${isLoggedIn}`);
                logger.info(`Session is alive, ${session.cookie._expires} user ${session.name} logged in successfully. User logged in --> ${isLoggedIn}`);
            }
            else
            {
                isLoggedIn = false;
                req.session.destroy();
                res.status(401).send(`Session timed out. User logged in --> ${isLoggedIn}`);
                logger.info(`Session timed out. User logged in --> ${isLoggedIn}`);
            }
        } catch {
            res.status(404);
            res.send({ error: "User doesn't exist!" });
            logger.error(`User doesn't exist! from base url ('/')`);
        }
    });


    //Create user api
    app.post("/api/adduser", async (req, res) => {
        var userData = new Users();
        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.password = req.body.password;
        userData.contactNumber = req.body.contactNumber;

        //validate email exists ?
        var isEmailExits = await mongo.validateEmailAccessibility(userData.email);
        //var isEmailExits = false;
        if(!isEmailExits)
        {
            userData.save()
            .then(async item => {
                res.status(200).send("User registration successful.");
                logger.info("User registration successful.");

                //Send mail after successfully register.
                await sendMailEngine(userData);   
                logger.info("Email sent");
            })
            .catch(err => {
                res.status(400).send("Unable to add new user.");
                logger.error(`Unable to add new user. \n  error details ${err}`);
            });
        }
        else
        {
            res.status(409).send("E-mail already in use.");
            logger.info("E-mail already in use.");
        }

    });

    //Email sending options (verify email code)
    async function sendMailEngine(userData) {

        var userId = await mongo.findUser(userData.email);
        console.log(userId);
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN 
        });

        mailer({
            from: process.env.EMAIL_USERNAME,
            to: `${userData.email}`,
            subject: 'Verify Your Email',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
            .email {
                width: 80%;
                margin: 0 auto;
            }

            .email-body {
                padding: 20px;
                background: linear-gradient(23deg, #d7d7d7, #c5bba00d);
            }

            .email-header {
                background: #cfcbff;
                padding: 20px;
                font-size: 32px;
                font-weight: bold;
                color: red;
            }

            .row {
                margin-right: 0;
                margin-left: 0;
            }

            .verify-link.col-md-12 {
                padding: 0;
                margin: 10px 0 10px 0;
            }

            .link-text {
                width: 20%;
                display: block;
                background: blue;
                padding: 10px 0px 10px 0px;
                color: white !important;
                text-align: center;
                text-decoration: none;
                font-weight: 600;
                border-radius: 8px;
            }

            .warning-text {
                color: red;
                padding: 0;
                font-size: 14px;
                font-weight: 600;
            }

            .team-text {
                font-size: 16px;
                margin-bottom: 20px;
                font-weight: 700;
            }

            .user-name {
                font-size: 16px;
                margin-bottom: 20px;
                font-weight: 600;
                color: #500050 !important;
            }

            @media only screen and (max-width: 766px) {
                .link-text {
                    width: 50%;
                }
            }

            </style>
            </head>
            <body>

            <div class="email col-md-12">
                <div class="row email-header">
                        Email Verification
                </div>

                <div class="email-body">
                    <div class="row user-name">
                        Hello ${userData.name},
                    </div>
                    <div class="row">
                        We just need to verify your email address before you can access Med-Reminder portal.
                    </div>
                    <div class="row">
                        Verify your email address 
                        <div class="verify-link col-md-12">
                            <a class="link-text" href="http://localhost:4001/verify/${token}">Veirfy Now</a>
                        </div>
                    </div>
                    <div class="row">
                        Thanks! 
                    </div>
                    <div class="row team-text">
                        The Med-Reminder team
                    </div>
                    <div class="row">
                        <div class="warning-text">***Please don't click this "Verify Now" link, if you are not requested this mail. Also please don't reply to this mail. Thanks!</div>
                    </div>
                </div>
            </div>
            </body>
            </html>
            `,
            textEncoding: "quoted-printable",
            encoding: "utf-8",
            headers: {
                "x-priority": "1",
                "x-msmail-priority": "High",
            importance: "high"
            }
        });
    }

    //verify token api
    app.get('/verify/:token', async (req, res) => {

        try {
            var payload = jwt.verify(req.params.token, process.env.JWT_SECRET);

            console.log(payload);
            var userId = new ObjectId(payload.id);
    
            await Users.updateOne({ _id: userId}, {$set: {verified: true}}).then(data => {
                if(data.modifiedCount > 0) {
                    res.status(200).send("Email verification successful.");
                    logger.info("Email verification successful.");
                }
                else
                {
                    res.status(422).send("User already verified.");
                    logger.info("User already verified.");
                }
                console.log(data);
            });
        }
        catch (err) {
            res.status(498).send("Invalid email verification link.");
            logger.warn("Invalid email verification link.");
        }
    });


    //Login api
    app.post('/api/login', async (req, res) => {
        try{
            await Users.findOne({email: req.body.email}).then(async function(result){
                if(result != null)
                {  
                    console.log("result ---->",result);
                    var verifiedPass = bcrypt.compareSync(req.body.password, result.password);
                    console.log("------->>>passowrd",verifiedPass);
                    if(verifiedPass)
                    {
                        if(result.verified)
                        {
                            res.status(200).json({ 
                                message : "logged in successfully.",
                                userId : result._id
                            });
                            session=req.session;
                            session.email = result.email;
                            session.name = result.name;
                            console.log(req.session);
                            logger.info("Login API called and Login successful");
                        }
                        else
                        {
                            await sendMailEngine(result);
                            res.status(403).send("Please verify the account and check your email (spam folder).");
                            logger.warn("Please verify the account and check your email (spam folder).");
                        }
                        
                    }
                    else{
                        res.status(401).send("Invalid credentials");
                        logger.warn("Invalid credentials..");
                    }
                }
                else
                {
                    res.status(401).send(`Invalid credentials.`);
                    logger.warn("Invalid credentials");
                }
            });
        }
        catch(err)
        {
            res.status(401).send("Some error occured during login.");
            logger.error("Some error occured during login.");
        }

    });

    //Logout api
    app.get('/api/logout',(req,res) => {
        try{
            req.session.destroy();
            logger.info("Logout successful.");
            res.status(200).send("Logout Successfully.")
            res.redirect('/');
        }
        catch (err) {
            res.status(401).send("Some error occured during logout.");
            logger.error("Some error occured during logout.");
        }

    });

    //Adding medicine 
    app.post('/api/addmedicine',async (req,res) => {

        try{        
            
            var medData = new Medicine();
            medData.medicineName = req.body.medicineName;
            medData.dose = req.body.dose;
            medData.medicineType = req.body.medicineType;
            medData.quantity = req.body.quantity;
            medData.userId = req.body.userId;
    
            //validate email exists ?
            var isMedExist = await mongo.validateMedicineName(medData.medicineName);
            //var isEmailExits = false;
            if(!isMedExist)
            {
                medData.save()
                .then(async item => {
                    res.status(200).send("Medicine Adding successful.");
                    logger.info("Medicine Adding successful.");
                })
                .catch(err => {
                    res.status(400).send("Unable to add new medicine.");
                    logger.error(`Unable to add new medicine. \n  error details ${err}`);
                });
            }
            else
            {
                res.status(409).send("Medicine already in available.");
                logger.info("Medicine already in available.");
            }

        }
        catch(err) {
            res.status(400).send("Some error occured during adding medicine.");
            logger.error("Some error occured during adding medicine.");
        }
    });
    

    app.get('/api/getmedicine', async (req,res) => {

        try {
            var x = req.headers['userid'];
            console.log(x);

            await Medicine.find({userId: x}).then(function(result){
                if(result != null)
                {  
                    console.log("result ---->",result);
                    res.status(200).json({
                        message: "Get Medicine successful.",
                        result: result
                    })
                    logger.info("Get Medicine successful.");
        
                }
                else
                {
                    res.status(401).send("Get Medicine unsuccessful.");
                    logger.warn("Get Medicine unsuccessful.");
                }
            });
        }
        catch (error)
        {
            console.log(error);
            res.status(400).send("Some error occured during getting medicine.");
            logger.error("Some error occured during getting medicine.");
        }
    })

    //listen server (dev mode)
    http.createServer(app).listen(4001);

    //This is for online server :
    //https.createServer(options, app).listen(4001);    

