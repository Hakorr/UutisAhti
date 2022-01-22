const Settings = require("../settings.js");

let site = "Karjalainen";
//Sketchy API - returns results not even on the page
let apiSearchURL = searchTerm => `https://www.karjalainen.fi/api/search?search-term=${encodeURIComponent(searchTerm)}&offset=0&sort=score&size=${Settings.config.searchResultLimit}`;
let imageURL = key => `https://fiare-prod-thumbor.assettype.com/${key}`;

const getJsonAccessor = articles => articles?.stories;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"    : (Object.keys(scoreList).indexOf(id) > -1) ? scoreList[id].score + 1 * scoreMultiplier : 1 * scoreMultiplier,
        "id"       : id,
        "category" : article?.sections[0].name,
        "headline" : article?.headline,
        "img_id"   : article['hero-image-s3-key'],
        "url"      : article?.url
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : bestMatch?.url,
        "img_id"  : imageURL(bestMatch?.img_id),
        "score"   : bestMatch?.score
    };
};

let siteSettings = {
    site: site,
    scoreMultiplier: 1,
    scoreList: {},
    requiresAuth: false,
    handleSingleArticle: handleSingleArticle,
    apiSearchURL: apiSearchURL,
    articleURL: articleURL,
    articleHandler: handleSingleArticle,
    handleBestResult: handleBestResult,
    getJsonAccessor: getJsonAccessor
};

module.exports = { siteSettings };