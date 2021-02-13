import express from 'express';
import Prices from '../models/prices.js'

var router = express.Router();

// UNCOMMENT TO TEST
/* const priceInput = {
    item: "scissors",
    stores: [
        {
            name: "hobby lobby",
            rating: "5",
            url: "hobbylobby.com",
            address: {
                zip: "93312",
                street: "1234 fake"
            },
            prices: [
                {
                    date: "9/25/2020",
                    amounts: "11.99"
                },
                {
                    date: "9/26/2020",
                    amounts: "12.50"
                }
            ]
        },
        {
            name: "Target",
            rating: "4",
            url: "target.com",
            address: {
                zip: "93307",
                street: "1234 not real"
            },
            prices: [
                {
                    date: "9/15/2020",
                    amounts: "13.99"
                },
                {
                    date:"9/16/2020",
                    amounts: "10.50"

                }
            ]
        }
    ]
}

const p = new Prices(priceInput);
p.save((err, document)=>{
    if(err)
        console.log(err);
    console.log(document);
}); */

router.post("/", (req, res) => {
    const dbPrices = req.body;
    Prices.create(dbPrices, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
        }
    });
});

router.get("/", (req, res) => {
    Prices.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});

export default router;