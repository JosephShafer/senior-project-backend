const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
require('dotenv').config()

/* Routers */
const priceRouter = require ('./routes/prices.js');
const usersRouter = require ('./routes/user.js');
const forgotPassRouter = require ('./routes/forgotPass.js');
const resetPassRouter = require ('./routes/resetPass.js');

const port = process.env.PORT || 8001;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

/* Using Routers */
app.use('/prices', priceRouter);
app.use('/users', usersRouter);
app.use('/forget_password', forgotPassRouter);
app.use('/reset_password', resetPassRouter);

/* Connect to DB */
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