import express from 'express';
import Users from '../models/user.js';
import bcrypt from 'bcrypt';
import dotenv  from "dotenv";
dotenv.config();

const router = express.Router();

router.get('/reset_password', (req, res) => {
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

router.put('/reset_password', (req, res) => {
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

export default router;