"use strict";
async function logic(payload = "") {
    var _a;
    const html = await sendRequest(`https://aniwatch.to/search?keyword=${encodeURIComponent(payload)}`, {});
    const document = (new DOMParser()).parseFromString(html, "text/html");
    const elements = document.querySelectorAll(".film_list-wrap .film-detail > h3 > a");
    const images = document.querySelectorAll(".film_list-wrap .film-poster > img");
    const subDub = document.querySelectorAll(".film_list-wrap > div > .film-poster > div.tick.ltr");
    const epCounts = document.querySelectorAll(".film_list-wrap > div > .film-poster > .tick.ltr > div");
    const titles = [];
    for (let i = 0; i < elements.length; i++) {
        const hasSub = subDub[i].innerText.includes("SUB");
        const hasDub = subDub[i].innerText.includes("DUB");
        const counts = epCounts[i].innerText.replace("Ep ", "").split("/");
        titles.push({
            url: `https://aniwatch.to${elements[i].getAttribute("href")}`,
            img: (_a = images[i].getAttribute("data-src")) !== null && _a !== void 0 ? _a : "",
            title: elements[i].innerText,
            indicatorText: `${hasSub ? "Sub" : ""}${hasSub && hasDub ? "|" : ""}${hasDub ? "Dub" : ""}`,
            currentCount: parseInt(counts[0]),
            totalCount: parseInt(counts[1]),
        });
    }
    sendResult(JSON.stringify(titles));
}
