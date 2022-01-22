const Settings = require("../settings.js");
const ArticleHandler = require("../utils/ArticleHandler.js");

let site = "Yle";
let app_id = "hakuylefi_v2_prod";
let apiSearchURL = (searchTerm) => `https://yle-fi-search.api.yle.fi/v1/search?app_id=${app_id}&app_key=${siteSettings.app_key}&language=fi&query=${encodeURIComponent(searchTerm)}&offset=0&limit=${Settings.config.searchResultLimit}&type=article`;
let imageURL = id => `https://images.cdn.yle.fi/image/upload/${id}`;

const getJsonAccessor = articles => articles?.data;
const getId = article => article?.id;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"    : score,
        "id"       : id,
        "category" : article?.services[0],
        "headline" : article?.headline,
        "img_id"   : article?.image?.id,
        "url"      : article?.url.short
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : settings.site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category || 'none',
        "url"     : bestMatch?.url,
        "img_url" : imageURL(bestMatch?.img_id),
        "score"   : bestMatch?.score
    };
};

let siteSettings = {
    site: site,
    scoreMultiplier: 1,
    scoreList: {},
    requiresAuth: true,
    app_key: '',
    handleSingleArticle: handleSingleArticle,
    apiSearchURL: apiSearchURL,
    articleHandler: handleSingleArticle,
    handleBestResult: handleBestResult,
    getJsonAccessor: getJsonAccessor,
    getId: getId
};

module.exports = { siteSettings };