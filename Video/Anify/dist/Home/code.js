"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    const data = JSON.parse(await sendRequest("https://api.anify.tv/seasonal?type=anime&apikey=a29078ed5ace232f708c0f2851530a61", {}));
    const spotlight_data = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];
        spotlight_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: (_c = (_b = (_a = item.title.english) !== null && _a !== void 0 ? _a : item.title.romaji) !== null && _b !== void 0 ? _b : item.title.native) !== null && _c !== void 0 ? _c : "",
                secondary: (_f = (_e = (_d = item.title.native) !== null && _d !== void 0 ? _d : item.title.romaji) !== null && _e !== void 0 ? _e : item.title.english) !== null && _f !== void 0 ? _f : "",
            },
            image: item.coverImage,
            subtitle: item.description,
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: item.season,
            showIcon: false,
            indicator: "Spotlight",
        });
    }
    const recents = JSON.parse(await sendRequest("https://api.anify.tv/recent?type=anime&apikey=a29078ed5ace232f708c0f2851530a61", {}));
    const recents_data = [];
    for (let i = 0; i < (recents === null || recents === void 0 ? void 0 : recents.length); i++) {
        const item = recents[i];
        recents_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: (_j = (_h = (_g = item.title.english) !== null && _g !== void 0 ? _g : item.title.romaji) !== null && _h !== void 0 ? _h : item.title.native) !== null && _j !== void 0 ? _j : "",
                secondary: (_m = (_l = (_k = item.title.native) !== null && _k !== void 0 ? _k : item.title.romaji) !== null && _l !== void 0 ? _l : item.title.english) !== null && _m !== void 0 ? _m : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_q = (_p = (_o = item.episodes) === null || _o === void 0 ? void 0 : _o.latest) === null || _p === void 0 ? void 0 : _p.latestEpisode) !== null && _q !== void 0 ? _q : 0),
            total: Number((_t = (_s = (_r = item.episodes) === null || _r === void 0 ? void 0 : _r.latest) === null || _s === void 0 ? void 0 : _s.totalEpisodes) !== null && _t !== void 0 ? _t : 0),
        });
    }
    const new_data = [];
    for (let i = 0; i < ((_u = data.trending) === null || _u === void 0 ? void 0 : _u.length); i++) {
        const item = data.trending[i];
        new_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: (_x = (_w = (_v = item.title.english) !== null && _v !== void 0 ? _v : item.title.romaji) !== null && _w !== void 0 ? _w : item.title.native) !== null && _x !== void 0 ? _x : "",
                secondary: (_0 = (_z = (_y = item.title.native) !== null && _y !== void 0 ? _y : item.title.romaji) !== null && _z !== void 0 ? _z : item.title.english) !== null && _0 !== void 0 ? _0 : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_3 = (_2 = (_1 = item.episodes) === null || _1 === void 0 ? void 0 : _1.latest) === null || _2 === void 0 ? void 0 : _2.latestEpisode) !== null && _3 !== void 0 ? _3 : 0),
            total: Number((_6 = (_5 = (_4 = item.episodes) === null || _4 === void 0 ? void 0 : _4.latest) === null || _5 === void 0 ? void 0 : _5.totalEpisodes) !== null && _6 !== void 0 ? _6 : 0),
        });
    }
    const top_viewed_data = [];
    for (let i = 0; i < ((_7 = data.top) === null || _7 === void 0 ? void 0 : _7.length); i++) {
        const item = data.top[i];
        top_viewed_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: (_10 = (_9 = (_8 = item.title.english) !== null && _8 !== void 0 ? _8 : item.title.romaji) !== null && _9 !== void 0 ? _9 : item.title.native) !== null && _10 !== void 0 ? _10 : "",
                secondary: (_13 = (_12 = (_11 = item.title.native) !== null && _11 !== void 0 ? _11 : item.title.romaji) !== null && _12 !== void 0 ? _12 : item.title.english) !== null && _13 !== void 0 ? _13 : "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number((_16 = (_15 = (_14 = item.episodes) === null || _14 === void 0 ? void 0 : _14.latest) === null || _15 === void 0 ? void 0 : _15.latestEpisode) !== null && _16 !== void 0 ? _16 : 0),
            total: Number((_19 = (_18 = (_17 = item.episodes) === null || _17 === void 0 ? void 0 : _17.latest) === null || _18 === void 0 ? void 0 : _18.totalEpisodes) !== null && _19 !== void 0 ? _19 : 0),
        });
    }
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data,
        },
        {
            type: "list",
            title: "Recently Released",
            data: recents_data,
        },
        {
            type: "grid_2x",
            title: "Now on Zoro",
            data: new_data,
        },
        {
            type: "grid_3x",
            title: "Most Viewed",
            data: top_viewed_data,
        },
    ];
    sendResult({
        action: "homepage",
        result,
    }, true);
}
