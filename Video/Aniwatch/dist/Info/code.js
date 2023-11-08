"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const html = await sendRequest(payload.query, {});
    const document = new DOMParser().parseFromString(html, "text/html");
    const titles = {
        primary: (_b = (_a = document.querySelector(".film-name.dynamic-name")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "",
        secondary: (_c = document.querySelector(".anisc-info > .item.item-title > .name")) === null || _c === void 0 ? void 0 : _c.innerText,
    };
    const description = (_f = (_e = (_d = document.querySelector(".item.item-title.w-hide > .text")) === null || _d === void 0 ? void 0 : _d.innerText) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
    const poster = (_g = document.querySelector(".film-poster-img")) === null || _g === void 0 ? void 0 : _g.getAttribute("src");
    const status = (_j = (_h = Array.from(document.querySelectorAll(".item.item-title"))
        .find((el) => el.innerText.includes("Status"))) === null || _h === void 0 ? void 0 : _h.querySelector(".name")) === null || _j === void 0 ? void 0 : _j.innerText;
    const totalMediaCount = document.querySelector(".tick-eps").innerText;
    const seasons = [...document.querySelectorAll(".os-list > a")].map((season) => {
        return { name: season.innerText.trim(), url: `https://aniwatch.to${season.getAttribute("href")}` };
    });
    const nextUrl = "https://aniwatch.to/ajax/v2/episode/list/" + ((_k = document.getElementById("wrapper")) === null || _k === void 0 ? void 0 : _k.getAttribute("data-id"));
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
    const myJsonObject = JSON.parse(await sendRequest(payload.query, {}));
    const document = new DOMParser().parseFromString(myJsonObject.html, "text/html");
    const allEpInfo = [...document.querySelectorAll(".ssl-item.ep-item")].map((e) => {
        var _a, _b, _c;
        return {
            url: "https://aniwatch.to/ajax/v2/episode/servers?episodeId=" + ((_a = e.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.split("?ep=")[1]),
            title: (_b = e.getAttribute("title")) !== null && _b !== void 0 ? _b : "",
            number: parseFloat((_c = e.getAttribute("data-number")) !== null && _c !== void 0 ? _c : ""),
        };
    });
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
