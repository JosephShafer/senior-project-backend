const express = require ('express');
const Users = require ('../models/user.js');
const bcrypt = require ('bcrypt');

const router = express.Router();

router.get('/', (req, res) => {
    const { token } = req.query;
    Users.findOne({
            reset_password_token: token,
            reset_password_expires: { $gt: Date.now() }
        })
        .then(user => {
            if (!user) {
                res.json({success: false, msg: "Reset passwork link is invalid/expired!"});
            } else {
                res.status(200).json({success: true, email: user.email, username: user.username})
            }
        })
        .catch(err => console.log("Error when opening link: " + err));   
});

// store new hashed password
router.put('/', (req, res) => {
    const { token, newPW } = {...req.body};
    const saltRounds = 10;
    bcrypt.hash(newPW, saltRounds, (err, hash) => {
        if (err) {
            res.status(422).json({success: false, msg: err});
        } else {
            const newHashedPass = hash;
            Users.findOneAndUpdate({ reset_password_token: token },
                {
                    // update pwd expiration and empty token
                    password: newHashedPass,
                    reset_password_expires: null,
                    reset_password_token: '', 
                },
            )
            .then(() => console.log('Password update successful'))
            .catch(err => console.log("Error when updating password: " + err));
        }
    });
});

module.exports = router;
