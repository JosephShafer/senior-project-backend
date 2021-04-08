const express = require('express');
const Users = require('../models/user.js');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', (req, res) => {
    const { username } = req.body;

    Users.findOne({ username })
    .then(user => {
        const hashed = user.password;
        bcrypt.compare(req.body.password, hashed)
        .then(result => {
            if (!result) throw new Error();
            req.session.username = req.body;
            req.user = user;
            req.user.password = undefined;
            req.user.__v = undefined;
            res.json({success: true, user: req.user});
        })
        .catch(() => 
            res.json({msg: "Failed when comparing password"}
        ));
    })
    .catch(err => 
        res.json({msg: "Sign in failed"}, console.log(err)
    ))
})

module.exports = router;