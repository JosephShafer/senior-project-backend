// replace 'youripaddress' with your IPv4 address
const express = require ('express');
const Users = require ('../models/user.js');
const crypto = require ('crypto');
const nodemailer = require ('nodemailer');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

router.put('/', (req, res) => {
    const email = req.body.email;
    Users.findOne({ email })
        .then(user => {
            if (user) {
                const token = crypto.randomBytes(20).toString('hex');
                return Users.findOneAndUpdate({ email }, 
                    {
                        reset_password_token: token, 
                        reset_password_expires: Date.now() + 86400000  // Token expires in 24 hrs
                    },
                    { new: true }
                ); 
            } else {
              return res.json({success: false, msg: "User not found"});
            }    
        })
        .then(user => {
            const token = user.reset_password_token;
            // encodes characters such as ?,=,/,&,:
            const uri = encodeURIComponent(`://192.168.1.77:19000/--/reset_password/${token}`);
            const mailOptions = {
                from: process.env.MAILER_EMAIL,
                to: email,
                subject: 'Snap & Go: Reset password link',
                html: 
                `
                <div>
                    <h3>Dear ${user.username},</h3>
                    <p>You've requested to reset your password, click the link below to do so.</p>
                    <br>
                    <p>https://expo.io/--/to-exp/exp${uri}</p>
                    <br>
                    <p>If you did not request this, ignore this email and your password will not change.</p>
                    <p>Thanks!</p>
                </div>
                `
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email was sent');
                    res.status(200).json({success: true});
                }
            })
        })
        .catch(err => console.log("Error when verifying the email: " + err));
});

module.exports = router;