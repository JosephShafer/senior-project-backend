const express = require('express');
const Searches = require('../models/search.js');

const router = express.Router();

router.post("/", (req, res) => {
    // console.log("GOT THIS FAR");
    const dbSearch = req.body;
    Searches
        .create(dbSearch)
        .then(result => 
            res.status(200).json({success: true, result})
        )
        .catch(err => console.log(err));
});

router.get("/", (req, res) => {
    // console.log("GOT THIS FAR");
    Searches.find((err, data) => {
        if (err) {
            console.log(err);
        } else{
            res.status(200).send(data);
        }
    });
});

router.post("/getUsersResults", (req, res) => {
    let email = req.body.email;
    console.log(email);
    Searches.findOne({email})
    .then(user => {
        console.log(user.searchTerms);
        res.json({usersSearches: user.searchTerms});
    })
});

router.put("/", (req, res) => {
    const dbSearch = req.body;
    console.log("DB HERE");
    console.log(dbSearch.searchTerms);
    Searches.updateOne(
        { email: dbSearch.email },
        {
            $push: {searchTerms: dbSearch.searchTerms} 
        }
    )
    .then(result => 
        res.status(200).json({success: true, result})
    )
    .catch(err => console.log(err));
});

module.exports = router;