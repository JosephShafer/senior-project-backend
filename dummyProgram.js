const fetch = require("node-fetch");
async function callWebCrawler(target) {
    try {
        console.log("Attempting connection to AWS server...");
        let response = await fetch("http://localhost:3000/webcrawl", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                searchTerm: target,
            }),
        });
        //var responseJson = await response.json();
        console.log("Connection successfully made.");
        return response.json();
    } catch(err) {
        console.log(err);
    }
}

let target = "wood";
// let timeout = 2000;

async function main() {
    let results = await callWebCrawler(target);
    console.log(results)
    // if(results.crawled) {
    //     console.log("Results for " + target + " not yet ready. Reconnecting...");
    //     setTimeout(async function() {
    //         results = await callWebCrawler(target);
    //         console.log(results);
    //     }, timeout);
    // } else {
    //     console.log(results);
    // }
}

// callWebCrawler(target);

main();