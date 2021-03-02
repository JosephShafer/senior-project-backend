// J.V. Created: 01-27-2021

// J.V. Update 01-27-2021: Added target variable, i.e. what web crawler is searching for
// J.V. Update 01-29-2021: Refactored, created WebCrawler.js
// J.V. Update 02-14-2021: Added pinterest to sites array - ideas
// J.V. Update 03-01-2021: Added server functionality with express

//---------------------------------------------------------------------------------------//

// *npm i crawler* - install dependencies
// node main.js    - execution

let express = require("express");
let WC = require("./WebCrawler.js");
let sites = ["https://www.kaplanco.com/shop/arts-and-crafts/collage-and-craft-materials",
	"https://www.pinterest.com/caytonmuseum/arts-craft-ideas/",
]
const APP = express();
const PORT = process.env.PORT || 3000;

APP.use(express.json());

APP.post("/webcrawl", async function(req, res) {
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

APP.listen(PORT, function() {
	console.log(`Starting server on port: ${PORT}`);
});


/*
let target = "paper";       // What to search for
for(let idx = 0; idx < sites.length; idx++) {
    WC.crawl(idx, sites[idx], target);
}
*/
