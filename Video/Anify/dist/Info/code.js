"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const titles = {
        primary: (_f = (_d = (_b = (_a = data.title) === null || _a === void 0 ? void 0 : _a.english) !== null && _b !== void 0 ? _b : (_c = data.title) === null || _c === void 0 ? void 0 : _c.romaji) !== null && _d !== void 0 ? _d : (_e = data.title) === null || _e === void 0 ? void 0 : _e.native) !== null && _f !== void 0 ? _f : "",
        secondary: (_m = (_k = (_h = (_g = data.title) === null || _g === void 0 ? void 0 : _g.native) !== null && _h !== void 0 ? _h : (_j = data.title) === null || _j === void 0 ? void 0 : _j.romaji) !== null && _k !== void 0 ? _k : (_l = data.title) === null || _l === void 0 ? void 0 : _l.english) !== null && _m !== void 0 ? _m : "",
    };
    const description = (_q = (_p = new DOMParser().parseFromString((_o = data.description) !== null && _o !== void 0 ? _o : "", "text/html").body.textContent) !== null && _p !== void 0 ? _p : data.description) !== null && _q !== void 0 ? _q : "";
    const poster = data.coverImage;
    const status = data.status;
    const totalMediaCount = (_r = data.totalEpisodes) !== null && _r !== void 0 ? _r : 0;
    const seasons = [];
    const nextUrl = `https://api.eltik.net/episodes/${data.id}`;
    function capitalize(s) {
        var _a, _b;
        s = s.toLowerCase();
        return s && ((_b = (_a = s[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : "") + s.slice(1);
    }
    function parseStatus(status) {
        return status === "NOT_YET_RELEASED" /* MediaStatus.NOT_YET_RELEASED */ ? "Not released" : capitalize(status);
    }
    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nextUrl],
            altTitles: (_s = data.synonyms) !== null && _s !== void 0 ? _s : [],
            description: description,
            poster: poster,
            banner: (_u = (_t = data.bannerImage) !== null && _t !== void 0 ? _t : poster) !== null && _u !== void 0 ? _u : "",
            status: parseStatus(status !== null && status !== void 0 ? status : "NOT_YET_RELEASED" /* MediaStatus.NOT_YET_RELEASED */),
            totalMediaCount,
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const id = payload.query.split("/episodes/")[1].split("?apikey=")[0];
    const results = [];
    const episodeCovers = JSON.parse(await sendRequest(`https://api.eltik.net/content-metadata?id=${id}`, {}));
    for (let i = 0; i < data.length; i++) {
        const episodes = (_b = (_a = data[i]) === null || _a === void 0 ? void 0 : _a.episodes) !== null && _b !== void 0 ? _b : [];
        for (let j = 0; j < episodes.length; j++) {
            const episodeNumber = (_d = (_c = episodes[j]) === null || _c === void 0 ? void 0 : _c.number) !== null && _d !== void 0 ? _d : 0;
            for (let k = 0; k < episodeCovers.length; k++) {
                for (let l = 0; l < ((_f = (_e = episodeCovers[k]) === null || _e === void 0 ? void 0 : _e.data) !== null && _f !== void 0 ? _f : []).length; l++) {
                    if (((_h = (_g = episodeCovers[k]) === null || _g === void 0 ? void 0 : _g.data[l]) === null || _h === void 0 ? void 0 : _h.number) === episodeNumber) {
                        if ((_k = (_j = episodeCovers[k]) === null || _j === void 0 ? void 0 : _j.data[l]) === null || _k === void 0 ? void 0 : _k.img) {
                            if (!((_l = episodes[j]) === null || _l === void 0 ? void 0 : _l.img)) {
                                Object.assign((_o = (_m = data[i]) === null || _m === void 0 ? void 0 : _m.episodes[j]) !== null && _o !== void 0 ? _o : {}, { img: (_q = (_p = episodeCovers[k]) === null || _p === void 0 ? void 0 : _p.data[l]) === null || _q === void 0 ? void 0 : _q.img });
                            }
                        }
                        if ((_s = (_r = episodeCovers[k]) === null || _r === void 0 ? void 0 : _r.data[l]) === null || _s === void 0 ? void 0 : _s.description) {
                            if (!((_t = episodes[j]) === null || _t === void 0 ? void 0 : _t.description)) {
                                Object.assign((_v = (_u = data[i]) === null || _u === void 0 ? void 0 : _u.episodes[j]) !== null && _v !== void 0 ? _v : {}, { description: (_x = (_w = episodeCovers[k]) === null || _w === void 0 ? void 0 : _w.data[l]) === null || _x === void 0 ? void 0 : _x.description });
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    data.map((provider) => {
        var _a;
        results.push({
            title: provider.providerId,
            list: ((_a = provider.episodes) !== null && _a !== void 0 ? _a : []).map((e) => {
                return {
                    url: `https://api.eltik.net/sources?providerId=${provider.providerId}&watchId=${e.id}&episodeNumber=${e.number}&id=${id}&subType=${"sub"}`,
                    title: e.title,
                    number: e.number,
                    image: e.img,
                    isFiller: e.isFiller,
                };
            }),
        });
    });
    sendResult({
        result: results,
        action: "eplist",
    }, true);
}
