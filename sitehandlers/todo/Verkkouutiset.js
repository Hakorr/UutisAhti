const Settings = require("../settings.js");

let site = "Verkkouutiset";
//Sketchy API - returns results not even on the page
let apiSearchURL = searchTerm => `https://www.verkkouutiset.fi/wp-json/kansalliskustannus/v1/posts?type=search?q=${encodeURIComponent(searchTerm)}&amount=${Settings.config.searchResultLimit}&page=1`;
let articleURL = titleSlug => `https://www.verkkouutiset.fi/${titleSlug}`;

const getJsonAccessor = articles => articles?.posts;
const getId = article => article?.permalink; //There's literally no ID

const handleSingleArticle = (article, score, id) => {
    return {
        "score"    : score,
        "id"       : id,
        "category" : article?.categories[0]?.name,
        "headline" : article?.title,
        "url"      : article?.permalink,
        "img_url"  : article?.image
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : settings.site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : bestMatch?.url,
        "img_url" : bestMatch?.img_url,
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
    getJsonAccessor: getJsonAccessor,
    getId: getId
};

module.exports = { siteSettings };