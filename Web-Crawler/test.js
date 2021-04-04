// Test file to debug web crawling on local pc
let WC = require("./WebCrawler.js");
const fs = require('fs');
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
let target = "card";
let productsFile = "./cachedResults/test-products.txt";
let projectsFile = "./cachedResults/test-projects.txt";
fs.writeFile(productsFile, "timeStamp", async function(err) {
    if(err) throw err;
});
fs.writeFile(projectsFile, "timeStamp", async function(err) {
    if(err) throw err;
});
async function main() {
    for(let i=0; i<sites.length; i++) {
        try {
            await WC.crawl(i, sites[i], target, productsFile, projectsFile);
        } catch(err) {
            console.log(err);
        }
    }
}

main();