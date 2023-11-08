async function logic(payload: BasePayload) {
    const baseURL = "https://gogoanime.hu";
    const searchHTML = await sendRequest(`${baseURL}/search.html?keyword=${encodeURIComponent(payload.query)}`, {});

    let dom = (new DOMParser()).parseFromString(searchHTML, "text/html");
    let itemsDOM = dom.querySelectorAll("ul.items li");
    let titles: SearchData = [];    

    for (var i = 0; i < itemsDOM.length; i++) {
        let con = itemsDOM[i];

        titles.push({ 
            url: `${baseURL}${con.querySelector("a")?.getAttribute("href")}`,
            img: con.querySelector("img")?.getAttribute("src")!,
            title: (con.querySelector(".name") as HTMLElement)?.innerText?.trim(),
            indicatorText: (con.querySelector(".released") as HTMLElement)?.innerText?.replace("Released:", "").trim(),
            currentCount: NaN,
            totalCount: NaN
        });
    }

    sendResult({
        action: "search",
        result: titles
    });
}