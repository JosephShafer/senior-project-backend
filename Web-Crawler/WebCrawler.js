// J.V. Created: 01-29-2021

// J.V. Update 02-14-2021: Added option for scraping pinterest for Arts & Crafts ideas
// J.V. Update 02-16-2021: Small bug fix

let Crawler = require("crawler");


// Main function
function crawl(idx, site, target) {
    let crawler = new Crawler({
        callback: function(err, res, done) {
            if(err) {
                console.log(err);
            } else {
                switch(idx) {
                    case 0:
                        kaplanco(res, target, site);
                        break;
                    case 1:
                        pinterest(res, target, site);
                        break;
                }
            }
            done();
        }
    });

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
    }
}

// Individual web page traversal
function kaplanco(res, target, site) {
    let $ = res.$;      // $ = Cheerio
    let products = $(".product-info").contents();
    let numProducts = products.length;
    for(let i=0; i<numProducts; i++) {
        if(products[i].attribs.class == "product-title") {
            let title = products[i].children[0].data;
            title = title.toLowerCase();
            let link = products[i].attribs.href;
            if(title.includes(target)) {
                console.log(title + "\t\t\t" + site.substr(0,24) + link);       // link for products just has domain name with href
            }
        }
    }
}

function pinterest(res, target, site) {
    let $ = res.$;
    let ideas = $(".GrowthUnauthPinImage").contents();
    let len = ideas.length;
    for(let i=0; i<len; i++) {
        if(ideas[i].name == 'a') {
            let obj = ideas[i];
            let title = obj.attribs.title.toLowerCase();
            let link = obj.attribs.href;
            if(title != undefined && title.includes(target)) {
                console.log(obj.attribs.title + "\n" + site.substr(0, 25) + link + "\n\n");
            }
        }
    }
}

// Exports
module.exports.crawl = crawl;