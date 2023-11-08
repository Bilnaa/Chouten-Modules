"use strict";
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f;
    const baseURL = "https://gogoanime.hu";
    const searchHTML = await sendRequest(`${baseURL}/search.html?keyword=${encodeURIComponent(payload.query)}`, {});
    let dom = (new DOMParser()).parseFromString(searchHTML, "text/html");
    let itemsDOM = dom.querySelectorAll("ul.items li");
    let titles = [];
    for (var i = 0; i < itemsDOM.length; i++) {
        let con = itemsDOM[i];
        titles.push({
            url: `${baseURL}${(_a = con.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")}`,
            img: (_b = con.querySelector("img")) === null || _b === void 0 ? void 0 : _b.getAttribute("src"),
            title: (_d = (_c = con.querySelector(".name")) === null || _c === void 0 ? void 0 : _c.innerText) === null || _d === void 0 ? void 0 : _d.trim(),
            indicatorText: (_f = (_e = con.querySelector(".released")) === null || _e === void 0 ? void 0 : _e.innerText) === null || _f === void 0 ? void 0 : _f.replace("Released:", "").trim(),
            currentCount: NaN,
            totalCount: NaN
        });
    }
    sendResult({
        action: "search",
        result: titles
    });
}
