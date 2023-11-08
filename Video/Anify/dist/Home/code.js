"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
    const data = JSON.parse(await sendRequest("https://api.eltik.net/seasonal?type=anime&fields=[id,title,coverImage,description,season,episodes,totalEpisodes]", {}));
    function capitalize(s) {
        var _a, _b;
        s = s.toLowerCase();
        return s && ((_b = (_a = s[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : "") + s.slice(1);
    }
    const seasonalData = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];
        seasonalData.push({
            url: `https://api.eltik.net/info/${item.id}`,
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
    const recents = JSON.parse(await sendRequest("https://api.eltik.net/recent?type=anime", {}));
    const recentData = [];
    for (let i = 0; i < (recents === null || recents === void 0 ? void 0 : recents.length); i++) {
        const item = recents[i];
        recentData.push({
            url: `https://api.eltik.net/info/${item.id}`,
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
            current: Number((_t = (_s = (_r = item.episodes) === null || _r === void 0 ? void 0 : _r.latest) === null || _s === void 0 ? void 0 : _s.latestEpisode) !== null && _t !== void 0 ? _t : 0),
            total: Number((_u = item.totalEpisodes) !== null && _u !== void 0 ? _u : 0),
        });
    }
    const trendingData = [];
    for (let i = 0; i < ((_v = data.trending) === null || _v === void 0 ? void 0 : _v.length); i++) {
        const item = data.trending[i];
        trendingData.push({
            url: `https://api.eltik.net/info/${item.id}`,
            titles: {
                primary: (_y = (_x = (_w = item.title.english) !== null && _w !== void 0 ? _w : item.title.romaji) !== null && _x !== void 0 ? _x : item.title.native) !== null && _y !== void 0 ? _y : "",
                secondary: (_1 = (_0 = (_z = item.title.native) !== null && _z !== void 0 ? _z : item.title.romaji) !== null && _0 !== void 0 ? _0 : item.title.english) !== null && _1 !== void 0 ? _1 : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_4 = (_3 = (_2 = item.episodes) === null || _2 === void 0 ? void 0 : _2.latest) === null || _3 === void 0 ? void 0 : _3.latestEpisode) !== null && _4 !== void 0 ? _4 : 0),
            total: Number((_5 = item.totalEpisodes) !== null && _5 !== void 0 ? _5 : 0),
        });
    }
    const topRatedData = [];
    for (let i = 0; i < ((_6 = data.top) === null || _6 === void 0 ? void 0 : _6.length); i++) {
        const item = data.top[i];
        topRatedData.push({
            url: `https://api.eltik.net/info/${item.id}`,
            titles: {
                primary: (_9 = (_8 = (_7 = item.title.english) !== null && _7 !== void 0 ? _7 : item.title.romaji) !== null && _8 !== void 0 ? _8 : item.title.native) !== null && _9 !== void 0 ? _9 : "",
                secondary: (_12 = (_11 = (_10 = item.title.native) !== null && _10 !== void 0 ? _10 : item.title.romaji) !== null && _11 !== void 0 ? _11 : item.title.english) !== null && _12 !== void 0 ? _12 : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_15 = (_14 = (_13 = item.episodes) === null || _13 === void 0 ? void 0 : _13.latest) === null || _14 === void 0 ? void 0 : _14.latestEpisode) !== null && _15 !== void 0 ? _15 : 0),
            total: Number((_16 = item.totalEpisodes) !== null && _16 !== void 0 ? _16 : 0),
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
