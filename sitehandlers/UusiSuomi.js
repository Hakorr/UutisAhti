const Settings = require("../settings.js");

let site = "Uusi Suomi";
let apiSearchURL = searchTerm => `https://www.uusisuomi.fi/api/pages/v2/listingpage/search/us/${encodeURIComponent(searchTerm)}/0/${Settings.config.searchResultLimit}`;
let articleURL = (department, titleSlug, uuid) => `https://www.tivi.fi/${department}/${titleSlug}/${uuid}`;
let imageURL = uuid => `https://assets.almatalent.fi/image/${uuid}`;

const getJsonAccessor = articles => articles?.searchList?.items;
const getId = article => article?.uuid;

const handleSingleArticle = (article, score, id) => {
    return {
        "score"      : score,
        "id"         : id,
        "category"   : article?.primaryCategory?.name || 'none',
        "headline"   : article?.teaserTitle,
        "img_uuid"   : article?.leadImageUuid,
        "titleSlug"  : article?.titleSlug,
        "department" : 'uutiset' //set manually, as there seems to be no variable for it
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