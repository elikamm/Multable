module.exports = (games, query) => {
    if (query) {
        games = games
            .filter(_ => Compare(_, query) > .5)
            .sort((a, b) => Compare(b, query) - Compare(a, query));
    }
    else {
        games = games
            .sort(_ => .5 - Math.random());
    }

    return games;
}

function Compare(str, query) {
    let matchA = 0, matchB = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == query[i]) matchA++;
        if (str[i] == query[matchB]) matchB++;
    }
    return Math.max(matchA, matchB) / query.length;
}