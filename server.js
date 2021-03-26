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
const readline = require('readline');
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

// Read first line of file
async function getFirstLine(pathToFile) {
	const readable = fs.createReadStream(pathToFile);
	const reader = readline.createInterface({ input: readable });
	const line = await new Promise((resolve) => {
		reader.on('line', (line) => {
			reader.close();
			resolve(line);
		});
	});
	readable.close();
	return line;
}

// JV. 03-15-2021: Manually merged branches
app.post("/webcrawl", async function(req, res) {
	let doCrawl = false;
	let target = req.body.searchTerm;
	let timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	let productsFile = "./Web-Crawler/cachedResults/" + target + "-products.txt";
	let projectsFile = "./Web-Crawler/cachedResults/" + target + "-projects.txt";
	console.log(`Received JSON response. Searching for ${target}`);
	// Check if these files exist
	try {
		if(await fs.existsSync(productsFile)) {
			// Check date if it does exist
			let fileDate = await getFirstLine(productsFile);
			let i = 0;
			for(i; i<fileDate.length; i++) {
				if(fileDate[i] != timeStamp[i]) break;
			}
			if(i > 10) {
				// Don't web crawl, return cached results
				doCrawl = false;
				console.log("Found current files for " + target + ". Will send cached results.");
			} else {
				// Update stored results
				doCrawl = true;
				console.log("Products & Projects files for " + target + " are outdated. Will create new files.");
				await fs.writeFile(productsFile, timeStamp, async function(err) {
					if(err) throw err;
				});
				await fs.writeFile(projectsFile, timeStamp, async function(err) {
					if(err) throw err;
				});
			}
		} else {
			doCrawl = true;
			console.log("Products & Projects files not found for " + target + ". Will create new files.");
			await fs.writeFile(productsFile, timeStamp, async function(err) {
				if(err) throw err;
			});
			await fs.writeFile(projectsFile, timeStamp, async function(err) {
				if(err) throw err;
			});
		}
	} catch(err) {
		console.log(err);
	}
	if(doCrawl) {
		// All results will be written to files
		for(let idx = 0; idx < sites.length; idx++) {
			try {
				await WC.crawl(idx, sites[idx], target, productsFile, projectsFile);
			} catch(err) {
				console.log(err);
			}
		}
		console.log("Finished web crawling");
	}
	// Read & Send results
	let products = fs.readFileSync(productsFile).toString().split("\n").splice(1);
	let projects = fs.readFileSync(projectsFile).toString().split("\n").splice(1);
	let json = req.body;
	json['products'] = products;
	json['projects'] = projects;
	json['crawled'] = doCrawl;
	res.json(json);
	res.end();
});


/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
