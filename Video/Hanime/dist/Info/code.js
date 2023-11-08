"use strict";
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const infoJSON = JSON.parse(await sendRequest(`https://hanime.tv/api/v8/video?id=${payload.query.split("/").pop()}`, {}));
    const description = (new DOMParser()).parseFromString((_b = (_a = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : "", "text/html").documentElement.innerText;
    sendResult({
        result: {
            id: "",
            titles: {
                primary: (_f = (_d = (_c = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : (_e = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _e === void 0 ? void 0 : _e.slug) !== null && _f !== void 0 ? _f : "",
                secondary: ""
            },
            epListURLs: [
                payload.query
            ],
            altTitles: [],
            description: description !== null && description !== void 0 ? description : "",
            poster: (_h = (_g = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _g === void 0 ? void 0 : _g.poster_url) !== null && _h !== void 0 ? _h : "",
            status: "",
            totalMediaCount: 1,
            mediaType: "Episodes",
            seasons: [],
            mediaList: []
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    var _a, _b, _c, _d;
    const infoJSON = JSON.parse(await sendRequest(`https://hanime.tv/api/v8/video?id=${payload.query.split("/").pop()}`, {}));
    sendResult({
        result: [{
                title: "Season 1",
                list: [{
                        url: payload.query,
                        number: 1,
                        title: (_d = (_b = (_a = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = infoJSON === null || infoJSON === void 0 ? void 0 : infoJSON.hentai_video) === null || _c === void 0 ? void 0 : _c.slug) !== null && _d !== void 0 ? _d : ""
                    }]
            }],
        action: "eplist"
    }, true);
}
