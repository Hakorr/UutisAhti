const Settings = require("../settings.js");

let site = "Iltalehti";
let apiSearchURL = searchTerm => `https://api.il.fi/v1/articles/search?q=${encodeURIComponent(searchTerm)}&limit=${Settings.config.searchResultLimit}`;
let articleURL = (category, id) => `https://www.iltalehti.fi/${category}/a/${id}`;

const getJsonAccessor = articles => articles?.response;
const getId = article => article?.article_id;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"    : score,
        "id"       : id,
        "category" : article?.category?.category_name || 'none',
        "headline" : article?.headline,
        "img_url"  : article?.main_image_urls?.default,
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : settings.site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : articleURL(bestMatch?.category, bestMatch?.id),
        "img_url" : bestMatch?.img_url,
        "score"   : bestMatch?.score
    };
};

let siteSettings = {
    site: site,
    scoreMultiplier: 1,
    scoreList: {},
    requiresAuth: false,
    app_key: '',
    handleSingleArticle: handleSingleArticle,
    apiSearchURL: apiSearchURL,
    articleURL: articleURL,
    articleHandler: handleSingleArticle,
    handleBestResult: handleBestResult,
    getJsonAccessor: getJsonAccessor,
    getId: getId
};

module.exports = { siteSettings };