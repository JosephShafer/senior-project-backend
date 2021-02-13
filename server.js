import express from 'express';
import mongoose from 'mongoose';

import priceRouter from './routes/prices.js';
import usersRouter from './routes/user.js';


const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

/* DB config */
const db = 
   "mongodb+srv://jacky:<password>@cluster0.rvtoj.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err));

app.get("/", (req, res) => res.status(200).send("HELLO WORLD"));

app.use('/prices', priceRouter);
app.use('/users', usersRouter);

/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));