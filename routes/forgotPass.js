import express from 'express';
import Users from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv  from "dotenv";
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

router.put('/forgot_password', (req, res) => {
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

export default router;
