import express from 'express';
import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv  from "dotenv";
dotenv.config();

/* Import Routers */
import priceRouter from './routes/prices.js';
import usersRouter from './routes/user.js';
import forgotPassRouter from './routes/forgotPass.js';
import resetPassRouter from './routes/resetPass.js';

const port = process.env.PORT || 8001;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

/* Using Routers */
app.use('/snapGo/prices', priceRouter);
app.use('/snapGo/users', usersRouter);
app.use('/forgotPass', forgotPassRouter);
app.use('/resetPass', resetPassRouter);

/* Connect to MongoDB */
mongoose.connect(process.env.LOCAL_MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err));

/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));