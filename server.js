// importing
import express from 'express';
import mongoose from 'mongoose';

// app config
const app = express()
const port = process.env.PORT || 9000;


// middlewares

// DB config
const mongoUri = 'mongodb+srv://jacky:<password>@cluster0.rvtoj.mongodb.net/SnapGo?retryWrites=true&w=majority';
mongoose.connect(mongoUri,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ?????

// API routes
app.get("/", (req, res) => res.status(200).send('HELLO WORLD'));

// listener
app.listen(port, () => console.log(`Listening on localhost: ${PORT}`));