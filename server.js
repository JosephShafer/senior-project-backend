// make sure to replace 'youripaddress' with your ip address
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv  from "dotenv";
dotenv.config();

import crypto from 'crypto';
import nodemailer from 'nodemailer';

/* Import Routers */
import priceRouter from './routes/prices.js';
import usersRouter from './routes/user.js';

const port = process.env.PORT || 8001;
import Users from './models/user.js';
import { google } from 'googleapis';
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Nodemailer using Gmail with Oath2 authentication
// Without oath2, Gmail account must enable less secure apps.
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const accessToken = await oauth2Client.getAccessToken();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAILER_EMAIL,
        //pass: process.env.MAILER_PASSWORD,
        clientId: process.env.CLIENT_UD,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
    }
});

// FORGOT PASSWORD
app.put('/forgot_password', (req, res) => {
    const email = req.body.email;
    Users
        .findOne({ email })
        .then(user => {
            if (user) {
                const token = crypto.randomBytes(20).toString('hex');
                return Users
                    .findOneAndUpdate({ email }, 
                        {
                            reset_password_token: token, 
                            reset_password_expires: Date.now() + 86400000  // Token expires in 24 hrs
                        },
                        { new: true } // return the updated user
                    ); 
            } else {
              return res.json({success: false, msg: "User not found"});
            }    
        })
        .then(user => {
            const token = user.reset_password_token;
            const uri = encodeURIComponent(`://youripaddress:19000/--/reset_password/${token}`);
            // STEP 2
            const mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Snap & Go: Reset password link',
                html: 
                `
                <div>
                    <h3>Dear ${user.username},</h3>
                    <p>You requested for a password reset, click below to reset your password.</p>
                    <br>
                    <p>https://expo.io/--/to-exp/exp${uri}</p>
                    <br>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p>Thanks!</p>
                </div>
                `
            };
            // STEP 3
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            })
        })
        .catch(err => console.log("Error when verifying email of reseting pw: " + err));
});

// RESET PASSWORD
app.get('/reset_password', (req, res) => {
    const { token } = req.query;
    Users
        .findOne({
            reset_password_token: token,
            reset_password_expires: { $gt: Date.now() }
        })
        .then(user => {
            if (!user) {
                res.json({success: false, msg: "Reset passwork link is invalid or expired!"});
            } else {
                res.status(200).json({success: true, username: user.username, email: user.email })
            }
        })
        .catch(err => console.log("Error when open reset_password link: " + err));   
});

app.put('/reset_password', (req, res) => {
    const { token, newPass } = req.body;

    bcrypt.hash(newPass, 10, (err, hashedPWD) => {
        if (err) {
            res.status(422).json({resetPW: false, "error": err});
        } else {
            const newHashedPWD = hashedPWD;
            Users
                .findOneAndUpdate(
                    { reset_password_token: token },
                    { 
                        password: newHashedPWD,
                        reset_password_expires: null,
                        reset_password_token: '', 
                    },
                )
                .then(result => res.status(200).json({resetPW: true, result}))
                .catch(err => console.log("Error when updating password: " + err));
        }
    });
});

/* Using Routers */
app.use('/snapGo/prices', priceRouter)
app.use('/snapGo/users', usersRouter)

/* Connect to MongoDB */
mongoose.connect(process.env.LOCAL_MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err));

/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));