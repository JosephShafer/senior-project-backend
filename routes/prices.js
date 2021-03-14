import express from 'express';
import Prices from '../models/prices.js'

const router = express.Router();

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