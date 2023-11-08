"use strict";
async function logic(payload) {
    var _a, _b;
    const baseURL = "https://gogoanime.hu";
    const html = await sendRequest(`https://ajax.gogo-load.com/ajax/page-recent-release-ongoing.html?page=1`, {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");
    const items = Array.from((_b = (_a = DOM === null || DOM === void 0 ? void 0 : DOM.querySelector(".added_series_body.popular")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("li")) !== null && _b !== void 0 ? _b : []).map((elem) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const current = (_d = (_c = (_b = Array.from((_a = elem === null || elem === void 0 ? void 0 : elem.querySelectorAll("a")) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.pop()) === null || _c === void 0 ? void 0 : _c.innerText) !== null && _d !== void 0 ? _d : "";
        return {
            url: `${baseURL}${(_f = (_e = elem === null || elem === void 0 ? void 0 : elem.querySelector("a")) === null || _e === void 0 ? void 0 : _e.getAttribute("href")) !== null && _f !== void 0 ? _f : ""}`,
            titles: {
                primary: (_h = (_g = elem === null || elem === void 0 ? void 0 : elem.querySelector("a")) === null || _g === void 0 ? void 0 : _g.getAttribute("title")) !== null && _h !== void 0 ? _h : "",
            },
            image: (_l = (_k = (_j = elem === null || elem === void 0 ? void 0 : elem.querySelector(".thumbnail-popular")) === null || _j === void 0 ? void 0 : _j.getAttribute("style")) === null || _k === void 0 ? void 0 : _k.split("'")[1]) !== null && _l !== void 0 ? _l : "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "Watch Now",
            indicator: "",
            current: isNaN(parseInt(current)) ? null : parseInt(current),
            total: null,
        };
    });
    const spotlight_data = [];
    try {
        spotlight_data.push(items.pop());
        spotlight_data.push(items.pop());
        spotlight_data.push(items.pop());
        for (const data of spotlight_data) {
            data.indicator = "Spotlight";
        }
    }
    catch (err) { }
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data,
        },
        {
            type: "grid_2x",
            title: "Recently Released",
            data: items,
        },
    ];
    console.log(result);
    sendResult({
        action: "homepage",
        result,
    }, true);
}
