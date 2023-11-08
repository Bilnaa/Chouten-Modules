async function getVRF(query: string, action: string): Promise<string> {
    const nineAnimeURL = "9anime.eltik.net";
    let reqURL = `https://${nineAnimeURL}/${action}?query=${encodeURIComponent(query)}&apikey=${"enimax"}`;

    const source = await sendRequest(reqURL, {});
    try {
        const parsedJSON = JSON.parse(source);

        if (parsedJSON.url) {
            return parsedJSON.url;
        } else {
            throw new Error(`${action}-VRF1: Received an empty URL or the URL was not found.`);
        }
    } catch (err) {
        throw new Error(`${action}-VRF1: Could not parse the JSON correctly.`);
    }
}


async function logic(payload: BasePayload) {
    let infoHTML = await sendRequest(payload.query, {});
    const infoDOM = (new DOMParser()).parseFromString(infoHTML, "text/html");

    const infoMainDOM = infoDOM.querySelector("#w-info")?.querySelector(".info")!;

    const nineAnimeID = infoDOM.querySelector("#watch-main")?.getAttribute("data-id")!;
    const titles = {
        primary: (infoMainDOM.querySelector(".title") as HTMLElement).innerText ?? "",
        secondary: "",
    };
    const description = (infoMainDOM.querySelector(".content") as HTMLElement)?.innerText ?? "";
    const poster = infoDOM.querySelector("#w-info")?.querySelector("img")?.getAttribute("src");
    const status = "";
    let seasons = [] as any[];

    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [
                nineAnimeID
            ],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: NaN,
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: []
        },
        action: "metadata",
    });
}


async function getEpList(payload: BasePayload) {
    const baseURL = "https://aniwave.to";
    const IDVRF = await getVRF(payload.query, "vrf");
    const episodesHTML = JSON.parse(await sendRequest(`${baseURL}/ajax/episode/list/${payload.query}?vrf=${encodeURIComponent(IDVRF)}`, {})).result;
    const episodesDOM = (new DOMParser()).parseFromString(episodesHTML, "text/html");
    const episodesElem = episodesDOM.querySelectorAll("li");
    
    const allEpInfo: {
        url: string,
        title: string,
        number: number
    }[] = [];

    for (let i = 0; i < episodesElem.length; i++) {
        const curElem = episodesElem[i];

        allEpInfo.push({
            url: curElem?.querySelector("a")?.getAttribute("data-ids") ?? "",
            title:  curElem.querySelector("span")?.innerText?.trim() ?? "",
            number: parseFloat(curElem?.querySelector("a")?.getAttribute("data-num") ?? "0")
        })
    }

    sendResult({
        result: [{
            title: "Season 1",
            list: allEpInfo
        }],
        action: "eplist"
    }, true);
}
