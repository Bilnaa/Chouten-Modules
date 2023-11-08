"use strict";
async function logic(payload) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23;
    const html = await sendRequest("https://aniwatch.to/home", {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");
    let top = DOM.querySelector(".deslide-wrap");
    let spotlights = top.querySelectorAll(".deslide-item");
    let spotlight_data = [];
    for (let i = 0; i < spotlights.length; i++) {
        let item = spotlights[i];
        spotlight_data.push({
            url: `https://aniwatch.to${item.querySelector(".desi-buttons > .btn.btn-secondary.btn-radius").getAttribute("href")}`,
            titles: {
                primary: (_a = item.querySelector(".desi-head-title.dynamic-name")) === null || _a === void 0 ? void 0 : _a.innerText,
                secondary: (_c = (_b = item.querySelector(".desi-head-title.dynamic-name")) === null || _b === void 0 ? void 0 : _b.getAttribute("data-jname")) !== null && _c !== void 0 ? _c : ""
            },
            image: (_e = (_d = item.querySelector(".film-poster-img")) === null || _d === void 0 ? void 0 : _d.getAttribute("data-src")) !== null && _e !== void 0 ? _e : "",
            subtitle: (_f = item.querySelector(".desi-description")) === null || _f === void 0 ? void 0 : _f.innerText.trim(),
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: (_g = item.querySelector(".sc-detail > div:nth-child(1)")) === null || _g === void 0 ? void 0 : _g.innerText.trim(),
            showIcon: false,
            indicator: "Spotlight"
        });
    }
    let recents_wrapper = (_h = DOM.querySelector("#main-content > section:nth-child(2)")) === null || _h === void 0 ? void 0 : _h.querySelector(".film_list-wrap");
    let recents = recents_wrapper.querySelectorAll(".flw-item");
    let recents_data = [];
    for (let i = 0; i < (recents === null || recents === void 0 ? void 0 : recents.length); i++) {
        let item = recents[i];
        recents_data.push({
            url: `https://aniwatch.to${item.querySelector(".dynamic-name").getAttribute("href")}`,
            titles: {
                primary: (_j = item.querySelector(".dynamic-name")) === null || _j === void 0 ? void 0 : _j.innerText
            },
            image: (_l = (_k = item.querySelector(".film-poster-img")) === null || _k === void 0 ? void 0 : _k.getAttribute("data-src")) !== null && _l !== void 0 ? _l : "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: (_o = (_m = item.querySelector(".tick-rate")) === null || _m === void 0 ? void 0 : _m.innerText) !== null && _o !== void 0 ? _o : "",
            current: item.querySelector(".tick-sub") != null ? parseInt((_q = (_p = item.querySelector(".tick-sub")) === null || _p === void 0 ? void 0 : _p.innerText) !== null && _q !== void 0 ? _q : "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt((_s = (_r = item.querySelector(".tick-eps")) === null || _r === void 0 ? void 0 : _r.innerText) !== null && _s !== void 0 ? _s : "") : null
        });
    }
    let new_wrapper = (_t = DOM.querySelector("#main-content > section:nth-child(5)")) === null || _t === void 0 ? void 0 : _t.querySelector(".film_list-wrap");
    let new_list = new_wrapper.querySelectorAll(".flw-item");
    let new_data = [];
    for (let i = 0; i < (new_list === null || new_list === void 0 ? void 0 : new_list.length); i++) {
        let item = new_list[i];
        new_data.push({
            url: `https://aniwatch.to${(_u = item.querySelector(".dynamic-name")) === null || _u === void 0 ? void 0 : _u.getAttribute("href")}`,
            titles: {
                primary: (_v = item.querySelector(".dynamic-name")) === null || _v === void 0 ? void 0 : _v.innerText
            },
            image: (_x = (_w = item.querySelector(".film-poster-img")) === null || _w === void 0 ? void 0 : _w.getAttribute("data-src")) !== null && _x !== void 0 ? _x : "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: (_z = (_y = item.querySelector(".tick-rate")) === null || _y === void 0 ? void 0 : _y.innerText) !== null && _z !== void 0 ? _z : "",
            current: item.querySelector(".tick-sub") != null ? parseInt((_1 = (_0 = item.querySelector(".tick-sub")) === null || _0 === void 0 ? void 0 : _0.innerText) !== null && _1 !== void 0 ? _1 : "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt((_3 = (_2 = item.querySelector(".tick-eps")) === null || _2 === void 0 ? void 0 : _2.innerText) !== null && _3 !== void 0 ? _3 : "") : null
        });
    }
    // #main-content > section:nth-child(8)
    let upcoming_wrapper = (_4 = DOM.querySelector("#main-content > section:nth-child(8)")) === null || _4 === void 0 ? void 0 : _4.querySelector(".film_list-wrap");
    let upcoming_list = upcoming_wrapper.querySelectorAll(".flw-item");
    let upcoming_data = [];
    for (let i = 0; i < (upcoming_list === null || upcoming_list === void 0 ? void 0 : upcoming_list.length); i++) {
        let item = upcoming_list[i];
        upcoming_data.push({
            url: `https://aniwatch.to${(_5 = item.querySelector(".dynamic-name")) === null || _5 === void 0 ? void 0 : _5.getAttribute("href")}`,
            titles: {
                primary: (_6 = item.querySelector(".dynamic-name")) === null || _6 === void 0 ? void 0 : _6.innerText
            },
            image: (_8 = (_7 = item.querySelector(".film-poster-img")) === null || _7 === void 0 ? void 0 : _7.getAttribute("data-src")) !== null && _8 !== void 0 ? _8 : "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: (_10 = (_9 = item.querySelector(".tick-rate")) === null || _9 === void 0 ? void 0 : _9.innerText) !== null && _10 !== void 0 ? _10 : "",
            current: item.querySelector(".tick-sub") != null ? parseInt((_12 = (_11 = item.querySelector(".tick-sub")) === null || _11 === void 0 ? void 0 : _11.innerText) !== null && _12 !== void 0 ? _12 : "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt((_14 = (_13 = item.querySelector(".tick-eps")) === null || _13 === void 0 ? void 0 : _13.innerText) !== null && _14 !== void 0 ? _14 : "") : null
        });
    }
    let top_viewed_wrapper = DOM.querySelector("#top-viewed-day");
    let top_viewed_list = top_viewed_wrapper.querySelectorAll("li");
    let top_viewed_data = [];
    for (let i = 0; i < (top_viewed_list === null || top_viewed_list === void 0 ? void 0 : top_viewed_list.length); i++) {
        let item = top_viewed_list[i];
        top_viewed_data.push({
            url: `https://aniwatch.to${(_15 = item.querySelector(".dynamic-name")) === null || _15 === void 0 ? void 0 : _15.getAttribute("href")}`,
            titles: {
                primary: (_16 = item.querySelector(".dynamic-name")) === null || _16 === void 0 ? void 0 : _16.innerText
            },
            image: (_18 = (_17 = item.querySelector(".film-poster-img")) === null || _17 === void 0 ? void 0 : _17.getAttribute("data-src")) !== null && _18 !== void 0 ? _18 : "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: ((_19 = item.querySelector(".fdi-item.ml-2")) === null || _19 === void 0 ? void 0 : _19.innerText) + " Views",
            current: item.querySelector(".tick-sub") != null ? parseInt((_21 = (_20 = item.querySelector(".tick-sub")) === null || _20 === void 0 ? void 0 : _20.innerText) !== null && _21 !== void 0 ? _21 : "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt((_23 = (_22 = item.querySelector(".tick-eps")) === null || _22 === void 0 ? void 0 : _22.innerText) !== null && _23 !== void 0 ? _23 : "") : null
        });
    }
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data
        },
        {
            type: "list",
            title: "Recently Released",
            data: recents_data
        },
        {
            type: "grid_2x",
            title: "Now on Zoro",
            data: new_data
        },
        {
            type: "list",
            title: "Top Upcoming",
            data: upcoming_data
        },
        {
            type: "grid_3x",
            title: "Most Viewed",
            data: top_viewed_data
        },
    ];
    sendResult({
        action: "homepage",
        result
    }, true);
}
