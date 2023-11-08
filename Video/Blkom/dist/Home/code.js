"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    const html = await sendRequest("https://blkom.com/", {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");
    const spotlights = DOM.querySelectorAll(".owl-carousel .item.episode");
    const spotlight_data = [];
    //spotlight
    spotlights.forEach((item) => {
        var _a, _b, _c, _d;
        let url = (_b = (_a = item.querySelector(".episode a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const element = item.querySelector(".text .name");
        const title = element ? (_d = (_c = element.textContent) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "" : "";
        const imageElement = item.querySelector(".image img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-src")}` : "";
        spotlight_data.push({
            url: url,
            titles: {
                primary: title,
            },
            image: imageUrl,
            subtitle: "",
            subtitleValue: [],
            buttonText: "شاهد الان",
            iconText: "",
            showIcon: false,
            indicator: "الانميات المتجددة",
        });
    });
    const sliced_spotlight_data = spotlight_data.slice(0, 12);
    //main content
    const recents = DOM.querySelectorAll(".recent-episode");
    const recents_data = [];
    recents.forEach((item) => {
        var _a, _b, _c, _d, _e;
        let url = (_b = (_a = item.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const imageElement = item.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const Title = (_e = (_d = (_c = item.querySelector(".text .name")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "";
        recents_data.push({
            url: url,
            titles: {
                primary: Title,
            },
            image: imageUrl,
            subtitle: "",
            subtitleValue: [],
            buttonText: "شاهد الان",
            iconText: "",
            showIcon: false,
            indicator: "آخر الأنميات المضافة",
        });
    });
    const sliced_recents_data = recents_data.slice(0, recents_data.length - 12);
    //poupular on balmok
    const populars = DOM.querySelectorAll(".recent-episode");
    const populars_data = [];
    populars.forEach((item) => {
        var _a, _b, _c, _d, _e;
        let url = (_b = (_a = item.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const imageElement = item.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const Title = (_e = (_d = (_c = item.querySelector(".text .name")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "";
        populars_data.push({
            url: url,
            titles: {
                primary: Title,
            },
            image: imageUrl,
            subtitle: "",
            subtitleValue: [],
            buttonText: "شاهد الان",
            iconText: "",
            showIcon: false,
            indicator: "أكثر أنميات الموسم مشاهدة",
        });
    });
    const sliced_populars_data = populars_data.slice(-12);
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: sliced_spotlight_data,
        },
        {
            type: "list",
            title: "آخر الأنميات المضافة",
            data: sliced_recents_data,
        },
        {
            type: "list",
            title: "أكثر أنميات الموسم مشاهدة",
            data: sliced_populars_data,
        },
    ];
    sendResult({
        action: "homepage",
        result,
    }, true);
}
