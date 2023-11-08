"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e;
    const baseURL = "https://blkom.com/";
    const searchHTML = await sendRequest(`${baseURL}/search?query=${encodeURIComponent(payload.query)}`, {});
    const searchDOM = new DOMParser().parseFromString(searchHTML, "text/html");
    const searchItems = searchDOM.querySelectorAll(".content");
    const titles = [];
    if (searchItems.length === 0) {
        throw new Error("لم يتم العثور على نتائج. استخدم الرومانجي لبعض العناوين.");
    }
    for (let i = 0; i < searchItems.length; i++) {
        const currentElem = searchItems[i];
        const url = (_b = (_a = currentElem.querySelector(".name a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "";
        const imageElement = currentElem.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const title = (_e = (_d = (_c = currentElem.querySelector(".name a")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "";
        titles.push({
            url: url,
            img: imageUrl,
            title: title,
            indicatorText: "",
            currentCount: NaN,
            totalCount: NaN,
        });
    }
    sendResult({
        action: "search",
        result: titles,
    });
}
