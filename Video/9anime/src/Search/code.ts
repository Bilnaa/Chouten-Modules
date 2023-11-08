export {};

async function logic(payload: BasePayload) {
    const baseURL = "https://aniwave.to";
    const searchHTML = await sendRequest(`${baseURL}/filter?keyword=${encodeURIComponent(payload.query)}`, {});
    const searchDOM = new DOMParser().parseFromString(searchHTML, "text/html");
    const searchElem = searchDOM.querySelector("#list-items")!;
    const searchItems = searchElem.querySelectorAll(".item");
    const titles: SearchData = [];

    if (searchItems.length === 0) {
        throw new Error("No results found.");
    }

    for (let i = 0; i < searchItems.length; i++) {
        const currentElem = searchItems[i];

        titles.push({
            url: `${baseURL}${currentElem.querySelector(".name")?.getAttribute("href")}`,
            img: currentElem.querySelector("img")?.getAttribute("src") ?? "",
            title: (currentElem.querySelector(".name") as HTMLElement)?.innerText?.trim() ?? "",
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
