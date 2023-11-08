"use strict";
async function logic(payload = "") {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const html = await sendRequest(payload, {});
    const document = (new DOMParser()).parseFromString(html, "text/html");
    const titles = {
        primary: (_b = (_a = document.querySelector(".film-name.dynamic-name")) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : "",
        secondary: (_c = document.querySelector(".anisc-info > .item.item-title > .name")) === null || _c === void 0 ? void 0 : _c.innerText,
    };
    const description = (_d = document.querySelector(".item.item-title.w-hide > .text")) === null || _d === void 0 ? void 0 : _d.innerText;
    const poster = (_e = document.querySelector(".film-poster-img")) === null || _e === void 0 ? void 0 : _e.getAttribute("src");
    const status = (_g = (_f = Array.from(document.querySelectorAll(".item.item-title"))
        .find((el) => el.innerText.includes("Status"))) === null || _f === void 0 ? void 0 : _f.querySelector(".name")) === null || _g === void 0 ? void 0 : _g.innerText;
    let totalMediaCount = document.querySelector(".tick-eps").innerText;
    let seasons = [...document.querySelectorAll(".os-list > a")].map((season) => {
        return { name: season.innerText.trim(), url: `https://aniwatch.to${season.getAttribute('href')}` };
    });
    let nextUrl = "https://aniwatch.to/ajax/v2/episode/list/" + ((_h = document.getElementById("wrapper")) === null || _h === void 0 ? void 0 : _h.getAttribute("data-id"));
    sendResult(JSON.stringify({
        result: {
            id: "",
            titles: titles,
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(totalMediaCount),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        nextUrl: null,
    }));
    getEpList(nextUrl);
}
async function getEpList(url) {
    const myJsonObject = JSON.parse(await sendRequest(url, {}));
    const document = (new DOMParser()).parseFromString(myJsonObject.html, "text/html");
    const allEpInfo = [...document.querySelectorAll(".ssl-item.ep-item")].map((e) => {
        var _a, _b, _c;
        return {
            url: "https://aniwatch.to/ajax/v2/episode/servers?episodeId=" +
                ((_a = e.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.split("?ep=")[1]),
            title: (_b = e.getAttribute("title")) !== null && _b !== void 0 ? _b : "",
            number: parseFloat((_c = e.getAttribute("data-number")) !== null && _c !== void 0 ? _c : ""),
        };
    });
    sendResult(JSON.stringify([{
            title: "Season 1",
            list: allEpInfo
        }]), true);
}
