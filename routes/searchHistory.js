const express = require('express');
const Searches = require('../models/search.js');

const router = express.Router();

router.post("/", (req, res) => {
    // console.log("GOT THIS FAR");
    console.log(req.body)
    const dbSearch = req.body;
    Searches
        .create(dbSearch)
        .then(result => 
            res.status(200).json({success: true, result})
        )
        .catch(err => {
            console.log(err)
            res.status(404).end();
        });
});

router.get("/", (req, res) => {
    // console.log("GOT THIS FAR");
    Searches.find((err, data) => {
        if (err) {
            console.log(err);
            res.status(404).end();
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
        let filtered = user.searchTerms.filter(function (el) {
            return (el != null && el != '');
        });
          console.log(filtered);
        res.json({usersSearches: filtered});
    })
    .catch(e => {
        console.log("User has no searches")
        res.status(404).end();
    })
});

router.put("/", (req, res) => {
    const dbSearch = req.body;
    console.log("DB HERE");
    Searches.updateOne(
        { email: dbSearch.email },
        {
            $push: {searchTerms: dbSearch.searchTerms} 
        }
    )
    .then(result => 
        res.status(200).json({success: true, result})
    )
    .catch(err => {
        console.log(err)
        res.status(404).end();
    });
});

module.exports = router;