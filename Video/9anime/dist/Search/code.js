"use strict";
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f;
    const baseURL = "https://aniwave.to";
    const searchHTML = await sendRequest(`${baseURL}/filter?keyword=${encodeURIComponent(payload.query)}`, {});
    const searchDOM = (new DOMParser()).parseFromString(searchHTML, "text/html");
    const searchElem = searchDOM.querySelector("#list-items");
    const searchItems = searchElem.querySelectorAll(".item");
    const titles = [];
    if (searchItems.length === 0) {
        throw new Error("No results found.");
    }
    for (let i = 0; i < searchItems.length; i++) {
        const currentElem = searchItems[i];
        titles.push({
            url: `${baseURL}${(_a = currentElem.querySelector(".name")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")}`,
            img: (_c = (_b = currentElem.querySelector("img")) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) !== null && _c !== void 0 ? _c : "",
            title: (_f = (_e = (_d = currentElem.querySelector(".name")) === null || _d === void 0 ? void 0 : _d.innerText) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "",
            indicatorText: "",
            currentCount: NaN,
            totalCount: NaN
        });
    }
    sendResult({
        action: "search",
        result: titles
    });
}
