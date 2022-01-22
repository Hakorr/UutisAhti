const Settings = require("../settings.js");

let site = "Kauppalehti";
let apiSearchURL = searchTerm => `https://www.kauppalehti.fi/api/search/v2/articles/kl/${encodeURIComponent(searchTerm)}/0/${Settings.config.searchResultLimit}`;
let articleURL = (department, titleSlug, uuid) => `https://www.kauppalehti.fi/${department}/${titleSlug}/${uuid}`;
let imageURL = uuid => `https://assets.almatalent.fi/image/${uuid}`;

const getJsonAccessor = articles => articles?.items;
const getId = article => article?.uuid;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"      : score,
        "id"         : id,
        "category"   : article?.primaryCategory?.name || 'none',
        "headline"   : article?.teaserTitle,
        "img_uuid"   : article?.leadImageUuid,
        "titleSlug"  : article?.titleSlug,
        "department" : article?.department || 'uutiset'
    };
};

const handleBestResult = (bestMatch, settings) => {
    return {
        "site"    : settings.site,
        "title"   : bestMatch?.headline,
        "category": bestMatch?.category,
        "url"     : articleURL(bestMatch?.department, bestMatch?.titleSlug, bestMatch?.id),
        "img_url" : imageURL(bestMatch?.img_uuid),
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