import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Prices from './models/PriceModel.js';
import Users from './models/UserModel.js';

// App config
const app = express();
const port = process.env.PORT || 8001;


// Middlewares
app.use(express.json());
app.use(Cors());

// DB config
const mongoUrl = 
    "mongodb+srv://jacky:<password>@cluster0.rvtoj.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// API Endpoints
app.get("/", (req, res) => res.status(200).send("HELLO WORLD"));

/* Post/Get methods for signup and login soon - work with ryan to discuss security of passwords */

app.post("/snapGo/users", (req, res) => {
    const dbUser = req.body;
    Users.create(dbUser, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
        }
    });
});

app.get("/snapGo/users", (req, res) => {
    Users.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});


app.post("/snapGo/prices", (req, res) => {
    const dbPrices = req.body;
    Prices.create(dbPrices, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(201).send(data);
        }
    });
});

app.get("/snapGo/prices", (req, res) => {
    Prices.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});

// Listener
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));