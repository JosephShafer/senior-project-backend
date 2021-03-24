const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
require('dotenv').config()

/* Import Routers */
const priceRouter = require ('./routes/prices.js');
const usersRouter = require ('./routes/user.js');
const forgotPassRouter = require ('./routes/forgotPass.js');
const resetPassRouter = require ('./routes/resetPass.js');
const fs = require('fs');
let WC = require("./Web-Crawler/WebCrawler.js");
let sites = ["https://www.kaplanco.com/shop/arts-and-crafts/collage-and-craft-materials",
	         "https://www.pinterest.com/caytonmuseum/arts-craft-ideas/",
]

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

/* Using Routers */
app.use('/prices', priceRouter);
app.use('/users', usersRouter);
app.use('/forget_password', forgotPassRouter);
app.use('/reset_password', resetPassRouter);

/* Connect to DB */
mongoose.connect(process.env.MONGO_URI, {
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
	let timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "\n";
	let productsFile = "./Web-Crawler/cachedResults/" + target + "-products.txt";
	let projectsFile = "./Web-Crawler/cachedResults/" + target + "-projects.txt";
	// Check if these files exist
	try {
		if(await fs.existsSync(productsFile)) {
			// Check date if it does exist

		} else {
			console.log("Products file not found for " + target + ". Will create new file.");
			await fs.writeFile(productsFile, timeStamp, async function(err) {
				if(err) throw err;
			});
		}
	} catch(err) {
		console.log(err);
	}
	try {
		if(await fs.existsSync(projectsFile)) {

		} else {
			console.log("Projects file not found for " + target + ". Will create new file.");
			await fs.writeFile(projectsFile, timeStamp, async function(err) {
				if(err) throw err;
			});
		}
	} catch(err) {
		console.log(err);
	}
	console.log(`Received JSON response. Searching for ${target}`);
	// All results will be written to files
	for(let idx = 0; idx < sites.length; idx++) {
		try {
			await WC.crawl(idx, sites[idx], target, productsFile, projectsFile);
		} catch(err) {
			console.log(err);
		}
	}
	console.log("Finished web crawling");
	res.end();
});


/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
