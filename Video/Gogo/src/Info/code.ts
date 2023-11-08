async function logic(payload: BasePayload) {
    const html = await sendRequest(payload.query, {});
    const document = (new DOMParser()).parseFromString(html, "text/html");

    const titles = {
        primary: document.querySelector<HTMLElement>("section.content_left > div.main_body > div:nth-child(2) > div.anime_info_body_bg > h1")?.innerText ?? "",
        secondary: document.querySelector<HTMLElement>("div.anime_info_body_bg > p:nth-child(9)")?.innerText?.replace("Other name: ", '')
        .replace(/;/g, ",") ?? "",
    };

    const description = document.querySelector<HTMLElement>("div.anime_info_body_bg > p:nth-child(5)")?.innerText?.replace("Plot Summary: ", "")?.trim() ?? "";
    const poster = document.querySelector<HTMLElement>("div.anime_info_body_bg > img")?.getAttribute("src");

    const status = document.querySelector<HTMLElement>("div.anime_info_body_bg > p:nth-child(8) > a")?.innerText?.trim() ?? "";

    // let seasons = [...document.querySelectorAll<HTMLElement>(".os-list > a")].map((season) => {
    //     return { name: season.innerText.trim(), url: `https://aniwatch.to${season.getAttribute('href')}` };
    // });

    let seasons = [] as any[];

    const li = document.querySelectorAll<HTMLElement>("#episode_page > li");
    const ep_start = li[0].querySelector("a")?.getAttribute("ep_start");
    const ep_end = li[li.length - 1].querySelector("a")?.getAttribute("ep_end");
    const movie_id = document.querySelector<HTMLElement>("#movie_id")?.getAttribute("value");
    const alias = document.querySelector<HTMLElement>("#alias_anime")?.getAttribute('value');

    const nextUrl = `https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`

    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [
                nextUrl
            ],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(ep_end!),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: []
        },
        action: "metadata",
    });
}


async function getEpList(payload: any) {
    const baseURL = "https://gogoanime.hu";
    const html = await sendRequest(payload.query, {});
    const document = (new DOMParser()).parseFromString(html, "text/html");
    const allEpInfo = [];
    const li = document.querySelectorAll("#episode_related > li");
    
    for(let i = 0; i < li.length; i++){
        const el = li[i];
        const num = parseFloat(el.querySelector<HTMLElement>(`div.name`)?.innerText?.replace('EP ', '') ?? "0");
        allEpInfo.push({
            url: `${baseURL}/${el.querySelector(`a`)?.getAttribute('href')?.trim()}`,
            number:  num,
            title: `Episode ${num}`
        });
    }

    sendResult({
        result: [{
            title: "Season 1",
            list: allEpInfo
        }],
        action: "eplist"
    }, true);
}
