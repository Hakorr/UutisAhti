const fs = require("fs");

const Request = require("../utils/Request.js");
const Sort = require("../utils/Sort.js");
const Settings = require("../settings.js");
const OCR = require("../utils/OCR.js");
const TextFormatter = require("../utils/TextFormatter.js");

const Aamulehti = require("../sitehandlers/Aamulehti.js");
const HelsinginSanomat = require("../sitehandlers/HelsinginSanomat.js");
const Iltalehti = require("../sitehandlers/Iltalehti.js");
const IltaSanomat = require("../sitehandlers/IltaSanomat.js");
const Kauppalehti = require("../sitehandlers/Kauppalehti.js");
const SatakunnanKansa = require("../sitehandlers/SatakunnanKansa.js");
const Tivi = require("../sitehandlers/Tivi.js");
const UusiSuomi = require("../sitehandlers/UusiSuomi.js");
const Yle = require("../sitehandlers/Yle.js");

let siteList = [
    Aamulehti,
    HelsinginSanomat,
    Iltalehti,
    IltaSanomat,
    Kauppalehti,
    SatakunnanKansa,
    Tivi,
    UusiSuomi,
    Yle
];

let finalResults = [];
let cb = null;

const fetchArticles = (api_url, callback) => {
    Request.get(api_url, (json) => {
        callback(json);
    });
};

const scoreArticles = (ocrResults, siteSettings) => {
    /* Articles are given a point if they contain a word or a sentence from the OCR's results
    -> The longer the string is, the more points it gives
    -> The article with the most points at the end will most likely be the article the image is from
    
    If there are only a few words, it performs quite poorly */
    let iteration = 0;
    let lastIteration = ocrResults.length;
    siteSettings.scoreList = {}; // Reset the score

    /* For each string of the OCR result (The sentence was splitted into an array) */
    ocrResults.forEach((ocrString) => {
        /* Get the article search results using their API */
        fetchArticles(siteSettings.apiSearchURL(ocrString), (articles) => {
            //If the get request failed
            if(articles != null) {
                siteSettings.scoreMultiplier = 1 + ocrString.length * 0.5;

                let jsonArticleList = siteSettings.getJsonAccessor(articles);

                if(Object.keys(jsonArticleList).length > 0) {
                    console.log(`${siteSettings.site}'s API found articles!`);
                    /* For each search's result (Give points to them, since they contained the word) */
                    jsonArticleList.forEach(article => {
                        let id = siteSettings.getId(article);
                        let score = (Object.keys(siteSettings.scoreList).indexOf(id) > -1) 
                            ? siteSettings.scoreList[id].score + 1 * siteSettings.scoreMultiplier 
                            : 1 * siteSettings.scoreMultiplier;

                        let resultObj = siteSettings.articleHandler(article, score, id);
                        siteSettings.scoreList[id] = resultObj;
                    });
                }
            } else {
                console.log(`Request to (${siteSettings.apiSearchURL(ocrString)}) failed`)
            }
            
            iteration = iteration + 1;
            if(iteration == lastIteration) sortArticles(siteSettings);
        });
    });
};

const fetchKey = (searchWordsArr, siteSettings) => {
    switch(siteSettings.site) {
        case "Yle":
            // Fetch an Yle page (that's as lightweight as possible) which has the app_key in its document
            fetchArticles("https://yle.fi/aihe/yleisradio/ylen-yhteystiedot", (doc) => { 
                if(doc == null) return;
                // Find a string between 'app_key=' and '&' - the result will be the app_key
                siteSettings.app_key = doc.split('app_key=').pop().split('&')[0];

                // Now, after we have the app_key, we can continue!
                // Before continuing, check if the key's length is somewhat logical (to ensure we actually got it)
                if(siteSettings.app_key.length > 25 && siteSettings.app_key.length < 50)
                    checkAuthentication(searchWordsArr, siteSettings);
            });
            break;

        //more cases in the future...
    }
};

const checkAuthentication = (searchWordsArr, siteSettings) => {
    //Check if the API needs authentication to search
    if(siteSettings.requiresAuth == true && siteSettings.app_key.length == 0)
        fetchKey(searchWordsArr, siteSettings,
            result => pushArticleToFinalResult(result));
    //The API doesn't need any authentication
    else scoreArticles(
        searchWordsArr,
        siteSettings
    );
};

//Run for each site, after iterated after all the search strings
const sortArticles = siteSettings => {
    let sortedArticles = Sort.sortArticlelist(siteSettings.scoreList);
    let bestMatch = sortedArticles[Object.keys(sortedArticles)[0]];
    
    if(typeof bestMatch == "object") {
        let finalResult = siteSettings.handleBestResult(bestMatch, siteSettings);
        let requiredScore = Settings.config.requiredScore;
        
        if(finalResult.score >= requiredScore) {
            pushArticleToFinalResult(
                finalResult
            );
        }
        else {
            pushArticleToFinalResult(
                {
                    site: siteSettings.site,
                    score: 0,
                    reason: `The best score didn't meet the treshhold (${finalResult.score}/${requiredScore})`
                }
            );
        }
    }
    else {
        pushArticleToFinalResult(
            {
                site: siteSettings.site,
                score: 0,
                reason: "Invalid object, probably empty (0 search results)"
            }
        );
    }
};

const pushArticleToFinalResult = article => {
    finalResults.push(article);

    // If every site has been searched
    if(finalResults.length == siteList.length) {
        // Decending sort for the final result
        let sortedFinal = Sort.sortFinal(finalResults);

        // Finally, return back to server.js with the final list of articles
        cb({
            'success': 1,
            'articles': sortedFinal
        });

        console.log("Finished the mass search!");
    }
};

const startSearch = (data, callback) => {
    console.log("Starting the mass article search...\n");
    let searchStrings = TextFormatter.cleanOcrResult(data);

    if(searchStrings.length == 0) {
        console.log("Aborting, found no text.");
        callback({
            'success': 0,
            'reason': "No text was detected"
        });
        return;
    }
    
    else if(searchStrings.length > 10) {
        console.log("Aborting, user tried to search too many strings.");
        callback({
            'success': 0,
            'reason': "You're trying to search too many strings"
        });
        return;
    }

    //For each site
    siteList.forEach(site => {
        checkAuthentication(
            searchStrings, 
            site.siteSettings, 
            callback
        );
    });
};

const initiateSearch = (data, mode, callback) => {
    //Reset the finalResults variable
    finalResults = [];
    cb = callback;

    switch(mode) {
        case "image":
            OCR.read(data, ocrResultStr => {
                //Remove the image file for server
                fs.stat(data, (err, stats) => {
                    if (err) return console.error(err);
                    
                    fs.unlink(data, err => {
                        if(err) return console.log(err);
                    });
                });
                startSearch(ocrResultStr, callback);
            });
            break;

        case "text":
            startSearch(data, callback);
            break;

        default:
            console.log("No correct type was specified");
            callback({
                'success': 0,
                'reason': "Internal server error"
            });
            break;
    }
};

module.exports = { initiateSearch };