"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const titles = {
        primary: (_f = (_d = (_b = (_a = data.title) === null || _a === void 0 ? void 0 : _a.english) !== null && _b !== void 0 ? _b : (_c = data.title) === null || _c === void 0 ? void 0 : _c.romaji) !== null && _d !== void 0 ? _d : (_e = data.title) === null || _e === void 0 ? void 0 : _e.native) !== null && _f !== void 0 ? _f : "",
        secondary: (_m = (_k = (_h = (_g = data.title) === null || _g === void 0 ? void 0 : _g.native) !== null && _h !== void 0 ? _h : (_j = data.title) === null || _j === void 0 ? void 0 : _j.romaji) !== null && _k !== void 0 ? _k : (_l = data.title) === null || _l === void 0 ? void 0 : _l.english) !== null && _m !== void 0 ? _m : "",
    };
    const description = (_o = new DOMParser().parseFromString(data.description, "text/html").textContent) !== null && _o !== void 0 ? _o : "";
    const poster = data.coverImage;
    const status = data.status;
    const totalMediaCount = (_p = data.totalEpisodes) !== null && _p !== void 0 ? _p : 0;
    const seasons = [];
    const nextUrl = "https://api.anify.tv/episodes/" + data.id + "?apikey=a29078ed5ace232f708c0f2851530a61";
    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nextUrl],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(totalMediaCount),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const results = [];
    data.map((provider) => {
        var _a;
        results.push({
            title: provider.providerId,
            list: ((_a = provider.episodes) !== null && _a !== void 0 ? _a : []).map((e) => {
                return {
                    url: `https://api.anify.tv/sources?providerId=${provider.providerId}&watchId=${e.id}&episode=${e.episode}&id=${payload.query.split("/episodes/")[1].split("&apikey=")[0]}&subType=${"sub"}&apikey=a29078ed5ace232f708c0f2851530a61`,
                    title: e.title,
                    number: e.number,
                };
            }),
        });
    });
    sendResult({
        result: results,
        action: "eplist",
    }, true);
}
