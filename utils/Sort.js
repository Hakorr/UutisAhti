const sortArticlelist = data => {
    let sorted = {};

    Object.keys(data).sort((a, b) => {
        return data[b].score - data[a].score;
    })
    .forEach(key => {
        sorted[key] = data[key];
    });

    return sorted;
};

const sortFinal = data => data.sort((a, b) => b.score - a.score);

module.exports = { sortArticlelist, sortFinal };