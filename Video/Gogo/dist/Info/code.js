"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const html = await sendRequest(payload.query, {});
    const document = new DOMParser().parseFromString(html, "text/html");
    const titles = {
        primary: (_b = (_a = document.querySelector("section.content_left > div.main_body > div:nth-child(2) > div.anime_info_body_bg > h1")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "",
        secondary: (_e = (_d = (_c = document.querySelector("div.anime_info_body_bg > p:nth-child(9)")) === null || _c === void 0 ? void 0 : _c.innerText) === null || _d === void 0 ? void 0 : _d.replace("Other name: ", "").replace(/;/g, ",")) !== null && _e !== void 0 ? _e : "",
    };
    const description = (_j = (_h = (_g = (_f = document.querySelector("div.anime_info_body_bg > p:nth-child(5)")) === null || _f === void 0 ? void 0 : _f.innerText) === null || _g === void 0 ? void 0 : _g.replace("Plot Summary: ", "")) === null || _h === void 0 ? void 0 : _h.trim()) !== null && _j !== void 0 ? _j : "";
    const poster = (_k = document.querySelector("div.anime_info_body_bg > img")) === null || _k === void 0 ? void 0 : _k.getAttribute("src");
    const status = (_o = (_m = (_l = document.querySelector("div.anime_info_body_bg > p:nth-child(8) > a")) === null || _l === void 0 ? void 0 : _l.innerText) === null || _m === void 0 ? void 0 : _m.trim()) !== null && _o !== void 0 ? _o : "";
    // let seasons = [...document.querySelectorAll<HTMLElement>(".os-list > a")].map((season) => {
    //     return { name: season.innerText.trim(), url: `https://aniwatch.to${season.getAttribute('href')}` };
    // });
    const seasons = [];
    const li = document.querySelectorAll("#episode_page > li");
    const ep_start = (_p = li[0].querySelector("a")) === null || _p === void 0 ? void 0 : _p.getAttribute("ep_start");
    const ep_end = (_q = li[li.length - 1].querySelector("a")) === null || _q === void 0 ? void 0 : _q.getAttribute("ep_end");
    const movie_id = (_r = document.querySelector("#movie_id")) === null || _r === void 0 ? void 0 : _r.getAttribute("value");
    const alias = (_s = document.querySelector("#alias_anime")) === null || _s === void 0 ? void 0 : _s.getAttribute("value");
    const nextUrl = `https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`;
    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nextUrl],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(ep_end),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
            banner: null,
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    var _a, _b, _c, _d, _e;
    const baseURL = "https://gogoanime.hu";
    const html = await sendRequest(payload.query, {});
    const document = new DOMParser().parseFromString(html, "text/html");
    const allEpInfo = [];
    const li = document.querySelectorAll("#episode_related > li");
    for (let i = 0; i < li.length; i++) {
        const el = li[i];
        const num = parseFloat((_c = (_b = (_a = el.querySelector(`div.name`)) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.replace("EP ", "")) !== null && _c !== void 0 ? _c : "0");
        allEpInfo.push({
            url: `${baseURL}/${(_e = (_d = el.querySelector(`a`)) === null || _d === void 0 ? void 0 : _d.getAttribute("href")) === null || _e === void 0 ? void 0 : _e.trim()}`,
            number: num,
            title: `Episode ${num}`,
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
