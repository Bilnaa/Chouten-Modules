"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    var _a, _b, _c, _d, _e;
    const infoHTML = await sendRequest(payload.query, {});
    const infoDOM = new DOMParser().parseFromString(infoHTML, "text/html");
    const infoMainDOM = infoDOM.querySelector(".anime-info-section");
    const MainLink = payload.query;
    let japName = "";
    let STInfo = "";
    let title = "";
    let posterURL = "";
    let number = 0;
    const numberElement = infoMainDOM.querySelector(".info-table span.info");
    if (numberElement) {
        const textContent = (_a = numberElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (textContent) {
            number = parseFloat(textContent);
        }
    }
    const posterElement = infoMainDOM.querySelector(".poster img");
    if (posterElement) {
        posterURL = (_b = posterElement === null || posterElement === void 0 ? void 0 : posterElement.getAttribute("data-original")) !== null && _b !== void 0 ? _b : "";
    }
    const titlele = infoMainDOM.querySelector(".name.col-xs-12 span h1");
    if (titlele) {
        title = titlele.innerText;
    }
    const StatusInfo = infoMainDOM.querySelectorAll(".info-table div");
    StatusInfo.forEach((element) => {
        var _a;
        const head = element.querySelector(".head");
        if (head && ((_a = head.textContent) === null || _a === void 0 ? void 0 : _a.includes("حالة الأنمي"))) {
            const info = element.querySelector(".info");
            if (info) {
                STInfo = info.textContent || "";
            }
        }
    });
    const japaneseName = infoMainDOM.querySelector('.names span[title="الاسم باليابانية"]');
    if (japaneseName) {
        japName = (_d = (_c = japaneseName === null || japaneseName === void 0 ? void 0 : japaneseName.textContent) === null || _c === void 0 ? void 0 : _c.replace("الاسم باليابانية :", "").trim()) !== null && _d !== void 0 ? _d : "";
    }
    const storyElement = infoMainDOM.querySelector(".story-container .story");
    const titles = {
        primary: title,
        secondary: japName,
    };
    const description = storyElement ? (_e = storyElement === null || storyElement === void 0 ? void 0 : storyElement.textContent) === null || _e === void 0 ? void 0 : _e.trim() : "";
    const poster = posterURL ? `https://blkom.com${posterURL}` : "";
    const seasons = [];
    sendResult({
        result: {
            id: "",
            titles: titles,
            banner: null,
            epListURLs: [MainLink],
            altTitles: [],
            description: description,
            poster: poster,
            status: STInfo,
            totalMediaCount: number,
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    const baseURL = "https://blkom.com/";
    const documentHTML = await sendRequest(payload.query, {});
    const document = new DOMParser().parseFromString(documentHTML, "text/html");
    const episodesElem = document.querySelectorAll(".episodes-list .episode-link");
    const allEpInfo = [];
    episodesElem.forEach((episodeElement) => {
        var _a, _b, _c, _d, _e;
        const episodeNumberStr = (_c = (_b = (_a = episodeElement.querySelector("span:nth-child(3)")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
        //const episodeTitle = episodeElement.querySelector('a span:nth-child(1)')?.textContent?.trim() ?? ""; i dont need it atm as long as the eps have the same title + the number as a variable.
        const episodeLink = (_e = (_d = episodeElement.querySelector("a")) === null || _d === void 0 ? void 0 : _d.getAttribute("href")) !== null && _e !== void 0 ? _e : "";
        const episodeNumber = parseInt(episodeNumberStr, 10);
        const episodeTitleNr = episodeNumber >= 0 ? `الحلقة ${episodeNumber}` : "";
        allEpInfo.push({
            url: episodeLink,
            title: episodeTitleNr,
            number: episodeNumber,
        });
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
