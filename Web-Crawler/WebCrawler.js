// J.V. Created: 01-29-2021

// J.V. Update 02-14-2021: Added option for scraping pinterest for Arts & Crafts ideas
// J.V. Update 02-16-2021: Small bug fix
// J.V. Update 03-01-2021: Links to products and project ideas are now written to files

let Crawler = require("crawler");
let fs = require("fs");

// Main function
function crawl(idx, site, target, productsFile, projectsFile) {
	let crawler = new Crawler({
		callback: function(err, res, done) {
			if(err) {
				console.log(err);
			} else {
				switch(idx) {
					case 0:
						kaplanco(res, target, site, productsFile);
						break;
					case 1:
						pinterest(res, target, site, projectsFile);
						break;
					case 17:
						artyCrafty(res, target, site, projectsFile);
						break;
					case 18:
						artyCrafty(res, target, site, projectsFile);
						break;
					default:
						// choices 2 - 16 are Michaels
						michaels(res, target, site, productsFile);
						break;
				}
			}
			done();
		}
	});
	let numPages = 0;
	// Traversing through result pages
	switch(idx) {
		case 0:
			// Kaplanco 1-8 pages
			let pageNum = 1;
			while(pageNum < 9) {
				crawler.queue(site + "?pg=" + pageNum);
				pageNum++;
			}
			break;
		case 1:
			// Pinterest
			crawler.queue(site);
			break;
		case 2:
			// Michaels - buttons section
			crawler.queue(site);
			break;
		case 3:
			// Michaels - fabrics section
			crawler.queue(site);
			// Page 2
			crawler.queue(site + "?page=2");
			break;
		case 4:
			// Michaels - wood section
			crawler.queue(site);
			// Page 2
			crawler.queue(site + "?page=2");
			break;
		case 5:
			// Michaels - feather section
			crawler.queue(site);
			// Page 2
			crawler.queue(site + "?page=2");
			break;
		case 6:
			// Michaels - glitter section
			crawler.queue(site);
			numPages = 3;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "?page=" + i);
			}
			break;
		case 7:
			// Michaels - glue section
			crawler.queue(site);
			numPages = 32;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "?page=" + i);
			}
			break;
		case 8:
			// Michaels - google eyes section
			crawler.queue(site);
			break;
		case 9:
			// Michaels - magnets section
			crawler.queue(site);
			break;
		case 10:
			// Michaels - miniatures section
			crawler.queue(site);
			numPages = 19;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "?page=" + i);
			}
			break;
		case 11:
			// Michaels - mirrors section
			crawler.queue(site);
			numPages = 6;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "?page=" + i);
			}
			break;
		case 12:
			// Michaels - origami section
			crawler.queue(site);
			break;
		case 13:
			// Michaels - paper mache section
			crawler.queue(site);
			break;
		case 14:
			// Michaels - pom poms & pipe cleaners section
			crawler.queue(site);
			break;
		case 15:
			// Michaels - styrofoam section
			crawler.queue(site);
			// Page 2
			crawler.queue(site + "?page=2");
			break;
		case 16:
			// Michaels - tools section
			crawler.queue(site);
			numPages = 6;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "?page=" + i);
			}
			break;
		case 17:
			// Arty Crafty - Art section 
			crawler.queue(site);
			numPages = 17;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "page/" + i + "/");
			}
			break;
		case 18:
			// Arty Crafty - Craft section 
			crawler.queue(site);
			numPages = 26;
			for(let i=2; i<=numPages; i++) {
				crawler.queue(site + "page/" + i + "/");
			}
			break;
		}
}

// Individual web page traversal
function kaplanco(res, target, site, productsFile) {
	let results = new Array();
	let $ = res.$;      // $ = Cheerio
	let products = $(".product-info").contents();
	let numProducts = products.length;
	for(let i=0; i<numProducts; i++) {
		if(products[i].attribs.class == "product-title") {
			let title = products[i].children[0].data;
			title = title.toLowerCase();
			let link = products[i].attribs.href;
			if(title.includes(target)) {
				let source = "\n" + site.substr(0,24) + link;
				//console.log(source);
				results.push(source);       // link for products just has domain name with href
			}
		}
	}
	for(let i=0; i<results.length; i++) {
		try {
			fs.appendFileSync(productsFile, results[i], function(err) {
				if(err) throw err;
			});
		} catch(err) {
			console.log(err);
		}
	}
}

function michaels(res, target, site, productsFile) {
	let results = new Array();
	let $ = res.$;
	let domain = "https://www.michaels.com";
	let products = $(".thumb-link");
	for(let i=0; i<products.length; i++) {
		let title = products[i].attribs.title.toLowerCase();
		let link = "";
		let href = products[i].attribs.href;
		if(!href.includes(domain)) {
			link = "\n" + domain + href;
		} else {
			link = "\n" + href;
		}
		if(title.includes(target)) {
			results.push(link);
		}
	}
	for(let i=0; i<results.length; i++) {
		try {
			fs.appendFileSync(productsFile, results[i], function(err) {
				if(err) throw err;
			});
		} catch(err) {
			console.log(err);
		}
	}
}

function artyCrafty(res, target, site, projectsFile) {
	let results = new Array();
	let $ = res.$;
	let ideas = $(".elementor-post__title").contents();
	for(let i=0; i<ideas.length; i++) {
		if(ideas[i].type == "tag") {
			let title = ideas[i].children[0].data.toLowerCase();
			let link = "\n" + ideas[i].attribs.href;
			if(title.includes(target)) {
				results.push(link);
			}
		}
	}
	for(let i=0; i<results.length; i++) {
		try {
			fs.appendFileSync(projectsFile, results[i], function(err) {
				if(err) throw err;
			});
		} catch(err) {
			console.log(err);
		}
	}
}

function pinterest(res, target, site, projectsFile) {
	let results = new Array();
	let $ = res.$;
	let ideas = $(".GrowthUnauthPinImage").contents();
	let len = ideas.length;
	for(let i=0; i<len; i++) {
		if(ideas[i].name == 'a') {
			let obj = ideas[i];
			let title = obj.attribs.title.toLowerCase();
			let link = obj.attribs.href;
			if(title != undefined && title.includes(target)) {
				//                console.log(obj.attribs.title + "\n" + site.substr(0, 25) + link);
				let source = "\n" + site.substr(0,25) + link;
				//console.log(source);
				results.push(source);
			}
		}
	}
	for(let i=0; i<results.length; i++) {
		try {
			fs.appendFileSync(projectsFile, results[i], function(err) {
				if(err) throw err;
			});
		} catch(err) {
			console.log(err);
		}
	}
}

// Exports
module.exports.crawl = crawl;
