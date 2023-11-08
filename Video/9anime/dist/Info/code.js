"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getVRF(query, action) {
    const nineAnimeURL = "9anime.eltik.net";
    const reqURL = `https://${nineAnimeURL}/${action}?query=${encodeURIComponent(query)}&apikey=${"enimax"}`;
    const source = await sendRequest(reqURL, {});
    try {
        const parsedJSON = JSON.parse(source);
        if (parsedJSON.url) {
            return parsedJSON.url;
        }
        else {
            throw new Error(`${action}-VRF1: Received an empty URL or the URL was not found.`);
        }
    }
    catch (err) {
        throw new Error(`${action}-VRF1: Could not parse the JSON correctly.`);
    }
}
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g;
    const infoHTML = await sendRequest(payload.query, {});
    const infoDOM = new DOMParser().parseFromString(infoHTML, "text/html");
    const infoMainDOM = (_a = infoDOM.querySelector("#w-info")) === null || _a === void 0 ? void 0 : _a.querySelector(".info");
    const nineAnimeID = (_b = infoDOM.querySelector("#watch-main")) === null || _b === void 0 ? void 0 : _b.getAttribute("data-id");
    const titles = {
        primary: (_c = infoMainDOM.querySelector(".title").innerText) !== null && _c !== void 0 ? _c : "",
        secondary: "",
    };
    const description = (_e = (_d = infoMainDOM.querySelector(".content")) === null || _d === void 0 ? void 0 : _d.innerText) !== null && _e !== void 0 ? _e : "";
    const poster = (_g = (_f = infoDOM.querySelector("#w-info")) === null || _f === void 0 ? void 0 : _f.querySelector("img")) === null || _g === void 0 ? void 0 : _g.getAttribute("src");
    const status = "";
    const seasons = [];
    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nineAnimeID],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: NaN,
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
            banner: null,
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    var _a, _b, _c, _d, _e, _f, _g;
    const baseURL = "https://aniwave.to";
    const IDVRF = await getVRF(payload.query, "vrf");
    const episodesHTML = JSON.parse(await sendRequest(`${baseURL}/ajax/episode/list/${payload.query}?vrf=${encodeURIComponent(IDVRF)}`, {})).result;
    const episodesDOM = new DOMParser().parseFromString(episodesHTML, "text/html");
    const episodesElem = episodesDOM.querySelectorAll("li");
    const allEpInfo = [];
    for (let i = 0; i < episodesElem.length; i++) {
        const curElem = episodesElem[i];
        allEpInfo.push({
            url: (_b = (_a = curElem === null || curElem === void 0 ? void 0 : curElem.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-ids")) !== null && _b !== void 0 ? _b : "",
            title: (_e = (_d = (_c = curElem.querySelector("span")) === null || _c === void 0 ? void 0 : _c.innerText) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "",
            number: parseFloat((_g = (_f = curElem === null || curElem === void 0 ? void 0 : curElem.querySelector("a")) === null || _f === void 0 ? void 0 : _f.getAttribute("data-num")) !== null && _g !== void 0 ? _g : "0"),
        });
    }
    sendResult({
        result: [
            {
                title: "Season 1",
                list: allEpInfo,
            },
        ],
        action: "eplist",
    }, true);
}
