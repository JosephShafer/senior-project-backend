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
            // console.log(req.body)
            req.session.username = req.body; 
            req.user = user;
            
            // can't delete password so change it to undefined to hide it
            req.user.password = undefined;
            req.user.__v = undefined;
            console.log(req.user)
            res.json({success: true, user: req.user});
        })
        .catch(() => 
            res.json({msg: "Failed when comparing password"}
        ));
    })
    .catch(err => 
        res.json({msg: "Sign in failed"}
    ))
})

module.exports = router;