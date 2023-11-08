export {};
async function logic(payload: BasePayload) {
    const baseURL = "https://blkom.com/";
    const searchHTML = await sendRequest(`${baseURL}/search?query=${encodeURIComponent(payload.query)}`, {});
    const searchDOM = new DOMParser().parseFromString(searchHTML, "text/html");
    const searchItems = searchDOM.querySelectorAll(".content");
    const titles: SearchData = [];

    if (searchItems.length === 0) {
        throw new Error("لم يتم العثور على نتائج. استخدم الرومانجي لبعض العناوين.");
    }

    for (let i = 0; i < searchItems.length; i++) {
        const currentElem = searchItems[i];
        const url = currentElem.querySelector(".name a")?.getAttribute("href") ?? "";
        const imageElement = currentElem.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const title = currentElem.querySelector(".name a")?.textContent?.trim() ?? "";
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
