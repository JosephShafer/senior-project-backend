// J.V. Created: 01-29-2021

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
            crawler.queue(site);
            break;
    }
}

// Individual web page traversal
function kaplanco(res, target, site) {
    let $ = res.$;      // $ = Cheerio
    let products = $(".product-info").contents();
    let numProducts = $(".product-info").contents().length;
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

// Exports
module.exports.crawl = crawl;