const express = require('express');
const Users = require('../models/user.js');

const router = express.Router();

router.post("/", (req, res) => {
    const dbUser = req.body;
    Users.create(dbUser, (err, data) => {
        if (err) {
            console.log(err);
        } else{
            res.status(201).send(data);
        }
    });
});

router.get("/", (req, res) => {
    Users.find((err, data) => {
        if (err) {
            console.log(err);
        } else{
            res.status(200).send(data);
        }
    });
});

module.exports = router;