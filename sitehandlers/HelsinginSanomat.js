const Settings = require("../settings.js");

let site = "Helsingin Sanomat";
let apiSearchURL = searchTerm => `https://www.hs.fi/api/search/${encodeURIComponent(searchTerm)}/kaikki/whenever/new/0/${Settings.config.searchResultLimit}/0/${Date.now()}`;
let articleURL = href => `https://www.hs.fi${href}`;

const getJsonAccessor = articles => articles;
const getId = article => article?.id;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"    : score,
        "id"       : id,
        "category" : article?.category || 'none',
        "headline" : article?.title,
        "img_url"  : article?.picture?.url.replace("WIDTH", article?.picture?.width),
        "href"     : article?.href
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : settings.site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : articleURL(bestMatch?.href),
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