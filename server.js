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
let WC = require("./Web-Crawler/WebCrawler.js");
let sites = ["https://www.kaplanco.com/shop/arts-and-crafts/collage-and-craft-materials",
	         "https://www.pinterest.com/caytonmuseum/arts-craft-ideas/",
]

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


// JV. 03-15-2021: Manually merged branches
app.post("/webcrawl", async function(req, res) {
	let target = req.body.searchTerm;
	console.log(`Received JSON response. Searching for ${target}`);
	// All results will be written to files
	for(let idx = 0; idx < sites.length; idx++) {
		try {
			await WC.crawl(idx, sites[idx], target);
		} catch(err) {
			console.log(err);
		}
	}
	console.log("Finished web crawling");
});


/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));