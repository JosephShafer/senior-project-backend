import express from 'express';
import Users from '../models/user.js'

var router = express.Router();

// UNCOMMENT TO TEST
// const userInput = {
//     firstName: "j",
//     lastName: "p",
//     email: "jpp@gmail.com",
//     username: "jpppppppp",
//     password: "1234567"
// }

// const user = new Users(userInput);
// user.save((err, document)=>{
//     if(err)
//         console.log(err);
//     console.log(document);
// });

router.post("/snapGo/users", (req, res) => {
    const dbUser = req.body;
    Users.create(dbUser, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
        }
    });
});

router.get("/snapGo/users", (req, res) => {
    Users.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});

export default router;