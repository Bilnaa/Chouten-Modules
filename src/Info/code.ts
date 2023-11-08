async function logic(payload: string = "") {
    const html = await sendRequest(payload, {});
    const document = (new DOMParser()).parseFromString(html, "text/html");

    const titles = {
        primary: document.querySelector<HTMLElement>(".film-name.dynamic-name")?.innerText ?? "",
        secondary: document.querySelector<HTMLElement>(".anisc-info > .item.item-title > .name")?.innerText,
    };

    const description = document.querySelector<HTMLElement>(".item.item-title.w-hide > .text")?.innerText;
    const poster = document.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("src");

    const status = Array.from(document.querySelectorAll<HTMLElement>(".item.item-title"))
        .find((el) => el.innerText.includes("Status"))
        ?.querySelector<HTMLElement>(".name")?.innerText;


    let totalMediaCount = document.querySelector<HTMLElement>(".tick-eps")!.innerText;
    let seasons = [...document.querySelectorAll<HTMLElement>(".os-list > a")].map((season) => {
        return { name: season.innerText.trim(), url: `https://aniwatch.to${season.getAttribute('href')}` };
    });

    let nextUrl = "https://aniwatch.to/ajax/v2/episode/list/" + document.getElementById("wrapper")?.getAttribute("data-id");


    sendResult(JSON.stringify({
        result: {
            id: "",
            titles: titles,
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(totalMediaCount),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        nextUrl: null,
    } as InfoData));

    getEpList(nextUrl);

}


async function getEpList(url: string) {
    const myJsonObject = JSON.parse(await sendRequest(url, {}));
    const document = (new DOMParser()).parseFromString(myJsonObject.html, "text/html");

    const allEpInfo = [...document.querySelectorAll(".ssl-item.ep-item")].map(
        (e) => {
            return {
                url:
                    "https://aniwatch.to/ajax/v2/episode/servers?episodeId=" +
                    e.getAttribute("href")?.split("?ep=")[1],
                title: e.getAttribute("title") ?? "",
                number: parseFloat(e.getAttribute("data-number") ?? ""),
            };
        }
    );

    sendResult(JSON.stringify([{ 
        title: "Season 1", 
        list: allEpInfo 
    } as InfoEpisodeList]), true);
}
