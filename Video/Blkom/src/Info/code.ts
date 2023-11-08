export {};

async function logic(payload: BasePayload) {
    const infoHTML = await sendRequest(payload.query, {});
    const infoDOM = new DOMParser().parseFromString(infoHTML, "text/html");
    const infoMainDOM = infoDOM.querySelector(".anime-info-section")!;

    const MainLink = payload.query;
    let japName = "";
    let STInfo = "";
    let title = "";
    let posterURL = "";
    let number = 0;

    const numberElement: Element | null = infoMainDOM.querySelector(".info-table span.info");
    if (numberElement) {
        const textContent = numberElement.textContent?.trim();
        if (textContent) {
            number = parseFloat(textContent);
        }
    }

    const posterElement = infoMainDOM.querySelector(".poster img");
    if (posterElement) {
        posterURL = posterElement?.getAttribute("data-original") ?? "";
    }

    const titlele = infoMainDOM.querySelector(".name.col-xs-12 span h1") as HTMLElement;

    if (titlele) {
        title = titlele.innerText;
    }

    const StatusInfo = infoMainDOM.querySelectorAll(".info-table div");
    StatusInfo.forEach((element) => {
        const head = element.querySelector(".head");
        if (head && head.textContent?.includes("حالة الأنمي")) {
            const info = element.querySelector(".info");
            if (info) {
                STInfo = info.textContent || "";
            }
        }
    });

    const japaneseName = infoMainDOM.querySelector('.names span[title="الاسم باليابانية"]');
    if (japaneseName) {
        japName = japaneseName?.textContent?.replace("الاسم باليابانية :", "").trim() ?? "";
    }

    const storyElement = infoMainDOM.querySelector(".story-container .story");

    const titles = {
        primary: title,
        secondary: japName,
    };
    const description = storyElement ? storyElement?.textContent?.trim() : "";
    const poster = posterURL ? `https://blkom.com${posterURL}` : "";
    const seasons = [] as any[];

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

async function getEpList(payload: BasePayload) {
    const baseURL = "https://blkom.com/";
    const documentHTML = await sendRequest(payload.query, {});
    const document = new DOMParser().parseFromString(documentHTML, "text/html");
    const episodesElem = document.querySelectorAll(".episodes-list .episode-link");

    const allEpInfo: {
        url: string;
        title: string;
        number: number;
    }[] = [];

    episodesElem.forEach((episodeElement) => {
        const episodeNumberStr = episodeElement.querySelector("span:nth-child(3)")?.textContent?.trim() ?? "";
        //const episodeTitle = episodeElement.querySelector('a span:nth-child(1)')?.textContent?.trim() ?? ""; i dont need it atm as long as the eps have the same title + the number as a variable.
        const episodeLink = episodeElement.querySelector("a")?.getAttribute("href") ?? "";
        const episodeNumber = parseInt(episodeNumberStr, 10);
        const episodeTitleNr = episodeNumber >= 0 ? `الحلقة ${episodeNumber}` : "";

        allEpInfo.push({
            url: episodeLink,
            title: episodeTitleNr,
            number: episodeNumber,
        });
    });

    sendResult(
        {
            result: [
                {
                    title: "Season 1",
                    list: allEpInfo,
                },
            ],
            action: "eplist",
        },
        true
    );
}
