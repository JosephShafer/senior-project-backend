const express = require('express');
const Users = require('../models/user.js');
const bcrypt = require('bcrypt');
const router = express.Router();

const SALT = 10;

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, SALT, (err, hash) => {
        if (err) {
            res.status(422).json({"error": err});
        } else {
            const user = req.body;
            user.password = hash;
            Users
                .create(user)
                .then(result => 
                    res.status(200).json({success: true, result})
                )
                .catch(err => console.log(err));
        }
    });
});

module.exports = router;