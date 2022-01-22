const ArticleHandler = require("../utils/ArticleHandler.js");
const Sort = require("../utils/Sort.js");
const Settings = require("../Settings.js");

//Sketchy API, doesn't provide valid results
let apiSearchURL = searchTerm => `https://prod2.vik.fi/solr/sk/all/select?q=${encodeURIComponent(searchTerm)}&rows=${Settings.config.searchResultLimit}&wt=json`;
let site = "Suomen Kuvalehti";

const scoreArticles = (ocrResults, callback) => {
    /* Articles are given a point if they contain a word or a sentence from the OCR's results
    -> The longer the string is, the more points it gives
    -> The article with the most points at the end will most likely be the article the image is from
    
    If there are only a few words, it performs quite poorly */

    let scoreList = {};
    let scoreMultiplier = 1;
    let iteration = 0;
    let lastIteration = ocrResults.length;
    
    /* For each string of the OCR result (The sentence was splitted into an array) */
    ocrResults.forEach((ocrString) => {

        /* Get the article search results using their API */
        ArticleHandler.fetchArticles(apiSearchURL(ocrString), (articles) => {
            scoreMultiplier = 1 + ocrString.length * 0.5;
            let jsonArticleList = articles?.response?.docs;

            if(Object.keys(jsonArticleList).length > 0) {
                /* For each search's result (Give points to them, since they contained the word) */
                jsonArticleList.forEach(article => {
                    let id = article?.ID;

                    let resultObj = {
                        "score"    : (Object.keys(scoreList).indexOf(id) > -1) ? scoreList[id].score + 1 * scoreMultiplier : 1 * scoreMultiplier,
                        "id"       : id,
                        "category" : article?.topic,
                        "headline" : article?.post_title,
                        "img_url"  : article?.main_image_urls?.default,
                        "url"      : article?.url
                    };

                    scoreList[id] = resultObj;
                });
            } else console.log(`${site}'s API didn't give any results for "${ocrString}"`);

            iteration = iteration + 1;
            if(iteration == lastIteration) {
                callback(scoreList);
            };
        });
    });
};

const search = (searchWordsArr, callback) => {
    scoreArticles(searchWordsArr, 
        list => sortArticles(list,callback));
};

const sortArticles = (scoreList, callback) => {
    let sortedArticles = Sort.sortObj(scoreList);
    let bestMatch = sortedArticles[Object.keys(sortedArticles)[0]];
    let finalResult = {
        "site"    : site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : bestMatch?.url,
        "img_url" : bestMatch?.img_url,
        "score"   : bestMatch?.score
    };

    let requiredScore = Settings.config.requiredScore;
    if(finalResult.score > requiredScore) callback(finalResult);
    else console.log(`${finalResult.site}'s best result didn't quality because it didn't meet the score treshold. (${finalResult.score}/${requiredScore})`);
};

module.exports = { search };