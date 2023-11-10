"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
    const data = JSON.parse(await sendRequest("https://api.anify.tv/seasonal?type=anime&fields=[id,title,coverImage,description,season,currentEpisode,totalEpisodes]", {}));
    function capitalize(s) {
        var _a, _b;
        s = s.toLowerCase();
        return s && ((_b = (_a = s[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : "") + s.slice(1);
    }
    const seasonalData = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];
        seasonalData.push({
            url: `https://api.anify.tv/info/${item.id}?fields=[id,title,description,coverImage,status,totalEpisodes,synonyms,bannerImage]`,
            titles: {
                primary: (_c = (_b = (_a = item.title.english) !== null && _a !== void 0 ? _a : item.title.romaji) !== null && _b !== void 0 ? _b : item.title.native) !== null && _c !== void 0 ? _c : "",
                secondary: (_f = (_e = (_d = item.title.native) !== null && _d !== void 0 ? _d : item.title.romaji) !== null && _e !== void 0 ? _e : item.title.english) !== null && _f !== void 0 ? _f : "",
            },
            image: item.coverImage,
            subtitle: (_j = (_h = new DOMParser().parseFromString((_g = item.description) !== null && _g !== void 0 ? _g : "", "text/html").body.textContent) !== null && _h !== void 0 ? _h : item.description) !== null && _j !== void 0 ? _j : "",
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: capitalize(item.season),
            showIcon: false,
            indicator: "Seasonal",
        });
    }
    const recents = JSON.parse(await sendRequest("https://api.anify.tv/recent?type=anime&fields=[id,title,coverImage,description,season,currentEpisode,totalEpisodes]", {}));
    const recentData = [];
    for (let i = 0; i < (recents === null || recents === void 0 ? void 0 : recents.length); i++) {
        const item = recents[i];
        recentData.push({
            url: `https://api.anify.tv/info/${item.id}?fields=[id,title,description,coverImage,status,totalEpisodes,synonyms,bannerImage]`,
            titles: {
                primary: (_m = (_l = (_k = item.title.english) !== null && _k !== void 0 ? _k : item.title.romaji) !== null && _l !== void 0 ? _l : item.title.native) !== null && _m !== void 0 ? _m : "",
                secondary: (_q = (_p = (_o = item.title.native) !== null && _o !== void 0 ? _o : item.title.romaji) !== null && _p !== void 0 ? _p : item.title.english) !== null && _q !== void 0 ? _q : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_r = item.currentEpisode) !== null && _r !== void 0 ? _r : 0),
            total: Number((_s = item.totalEpisodes) !== null && _s !== void 0 ? _s : 0),
        });
    }
    const trendingData = [];
    for (let i = 0; i < ((_t = data.trending) === null || _t === void 0 ? void 0 : _t.length); i++) {
        const item = data.trending[i];
        trendingData.push({
            url: `https://api.anify.tv/info/${item.id}?fields=[id,title,description,coverImage,status,totalEpisodes,synonyms,bannerImage]`,
            titles: {
                primary: (_w = (_v = (_u = item.title.english) !== null && _u !== void 0 ? _u : item.title.romaji) !== null && _v !== void 0 ? _v : item.title.native) !== null && _w !== void 0 ? _w : "",
                secondary: (_z = (_y = (_x = item.title.native) !== null && _x !== void 0 ? _x : item.title.romaji) !== null && _y !== void 0 ? _y : item.title.english) !== null && _z !== void 0 ? _z : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_0 = item.currentEpisode) !== null && _0 !== void 0 ? _0 : 0),
            total: Number((_1 = item.totalEpisodes) !== null && _1 !== void 0 ? _1 : 0),
        });
    }
    const topRatedData = [];
    for (let i = 0; i < ((_2 = data.top) === null || _2 === void 0 ? void 0 : _2.length); i++) {
        const item = data.top[i];
        topRatedData.push({
            url: `https://api.anify.tv/info/${item.id}?fields=[id,title,description,coverImage,status,totalEpisodes,synonyms,bannerImage]`,
            titles: {
                primary: (_5 = (_4 = (_3 = item.title.english) !== null && _3 !== void 0 ? _3 : item.title.romaji) !== null && _4 !== void 0 ? _4 : item.title.native) !== null && _5 !== void 0 ? _5 : "",
                secondary: (_8 = (_7 = (_6 = item.title.native) !== null && _6 !== void 0 ? _6 : item.title.romaji) !== null && _7 !== void 0 ? _7 : item.title.english) !== null && _8 !== void 0 ? _8 : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_9 = item.currentEpisode) !== null && _9 !== void 0 ? _9 : 0),
            total: Number((_10 = item.totalEpisodes) !== null && _10 !== void 0 ? _10 : 0),
        });
    }
    const result = [
        {
            type: "Carousel",
            title: "Seasonal",
            data: seasonalData,
        },
        {
            type: "list",
            title: "Recently Released",
            data: recentData,
        },
        {
            type: "grid_2x",
            title: "Currently Trending",
            data: trendingData,
        },
        {
            type: "grid_3x",
            title: "Highest Rated",
            data: topRatedData,
        },
    ];
    sendResult({
        action: "homepage",
        result,
    }, true);
}
