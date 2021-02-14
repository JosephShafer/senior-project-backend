// J.V. Created: 01-27-2021

// J.V. Update 01-27-2021: Added target variable, i.e. what web crawler is searching for
// J.V. Update 01-29-2021: Refactored, created WebCrawler.js
// J.V. Update 02-14-2021: Added pinterest to sites array - ideas

//---------------------------------------------------------------------------------------//

// *npm i crawler* - install dependencies
// node main.js    - execution

let WC = require("./WebCrawler.js");
let sites = ["https://www.kaplanco.com/shop/arts-and-crafts/collage-and-craft-materials",
             "https://www.pinterest.com/caytonmuseum/arts-craft-ideas/",
            ]
let target = "paper";       // What to search for
let idx = 0;                // Keep track off what website we are currently on

for(idx; idx < sites.length; idx++)
    WC.crawl(idx, sites[idx], target);