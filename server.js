const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const session = require('express-session');
require('dotenv').config()

/* Import Routers */
const priceRouter = require ('./routes/prices.js');
const usersRouter = require ('./routes/user.js');
const forgotPassRouter = require ('./routes/forgotPass.js');
const resetPassRouter = require ('./routes/resetPass.js');
const signUpRouter = require('./routes/signUp.js');
const signInRouter = require('./routes/signIn.js');
const signOutRouter = require('./routes/signOut.js')

const fs = require('fs');
const readline = require('readline');
let WC = require("./Web-Crawler/WebCrawler.js");
let sites = ["https://www.kaplanco.com/shop/arts-and-crafts/collage-and-craft-materials",
	"https://www.pinterest.com/caytonmuseum/arts-craft-ideas/",
    // Begin Michaels
	"https://www.michaels.com/craft-basics/buttons-and-pins/834499117",		// Buttons
    "https://www.michaels.com/craft-basics/craft-fabrics/844963246",        // Fabrics
    "https://www.michaels.com/craft-basics/craft-sticks-and-dowels/834499126", // Wood
    "https://www.michaels.com/craft-basics/feathers-and-boas/876270944",    // Feathers
    "https://www.michaels.com/craft-basics/glitter-and-sequins/926198382",  // Glitter
    "https://www.michaels.com/crafts-and-hobbies/adhesives/809188651",      // Glue
    "https://www.michaels.com/craft-basics/googly-eyes/834499277",          // Google Eyes
    "https://www.michaels.com/craft-basics/magnets-and-closures/834499250", // Magnets
    "https://www.michaels.com/crafts-and-hobbies/miniatures/863221268",     // Miniatures
    "https://www.michaels.com/craft-basics/glass-and-mirrors/926198402",    // Mirrors
    "https://www.michaels.com/craft-basics/origami/834499254",              // Origami
    "https://www.michaels.com/craft-basics/paper-mache-crafts/834499258",   // Paper mache
    "https://www.michaels.com/craft-basics/poms-and-chenille-stems/926198415", // Pom poms & pipe cleaners
    "https://www.michaels.com/craft-basics/styrofoam/861667547",            // Styrofoam
    "https://www.michaels.com/craft-basics/tools-and-accessories/834499270",// Tools
    // End Michaels
    "https://www.artycraftykids.com/art/",
    "https://www.artycraftykids.com/craft/",
]

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

/* Using Routers */
app.use('/prices', priceRouter);
app.use('/users', usersRouter);
app.use('/forgot_password', forgotPassRouter);
app.use('/reset_password', resetPassRouter);
app.use('/signup', signUpRouter);
app.use('/signin', signInRouter);
app.use('/signout', signOutRouter);

// J.P: every user will be assigned a unique session

app.use(session ({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
// J.P: Validate user other than signin & signup routers
app.use((req, res, next) => {
	if(req.originalUrl === '/signin' || req.originalUrl === '/signup')
		return next();
	if(!req.session.username) {
		res.json({msg: 'User is not logged in'});
		return;
	}
	next();
});

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
	let waitTime = 4000;	// milliseconds
	let target = req.body.searchTerm;
	let timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	let productsFile = "./Web-Crawler/cachedResults/" + target + "-products.txt";
	let projectsFile = "./Web-Crawler/cachedResults/" + target + "-projects.txt";
	console.log(`Received JSON response. Searching for ${target}`);
	// Check if these files exist
	try {
		if(fs.existsSync(productsFile)) {
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
				await fs.writeFile(productsFile, timeStamp, function(err) {
					if(err) throw err;
				});
				await fs.writeFile(projectsFile, timeStamp, function(err) {
					if(err) throw err;
				});
			}
		} else {
			doCrawl = true;
			console.log("Products & Projects files not found for " + target + ". Will create new files.");
			await fs.writeFile(productsFile, timeStamp, function(err) {
				if(err) throw err;
			});
			await fs.writeFile(projectsFile, timeStamp, function(err) {
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
				WC.crawl(idx, sites[idx], target, productsFile, projectsFile);
			} catch(err) {
				console.log(err);
			}
		}
		console.log("Finished web crawling");
		let wait = setTimeout(function() {
			 // Read & Send results
			let products = fs.readFileSync(productsFile).toString().split("\n").splice(1);
			let projects = fs.readFileSync(projectsFile).toString().split("\n").splice(1);
			let json = req.body;
			json['products'] = products;
			json['projects'] = projects;
			json['crawled'] = doCrawl;
			res.json(json);
			res.end();
		}, waitTime);
	} else {
		// Read & Send results
		let products = fs.readFileSync(productsFile).toString().split("\n").splice(1);
		let projects = fs.readFileSync(projectsFile).toString().split("\n").splice(1);
		let json = req.body;
		json['products'] = products;
		json['projects'] = projects;
		json['crawled'] = doCrawl;
		res.json(json);
		res.end();
	}
});


/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
