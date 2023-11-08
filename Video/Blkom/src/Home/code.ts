export {};
async function logic(payload: BasePayload) {
    const html = await sendRequest("https://blkom.com/", {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");

    const spotlights = DOM.querySelectorAll<HTMLElement>(".owl-carousel .item.episode");

    const spotlight_data: Array<HompageData> = [];
    //spotlight
    spotlights.forEach((item) => {
        let url = item.querySelector(".episode a")?.getAttribute("href") ?? "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const element = item.querySelector(".text .name");
        const title = element ? element.textContent?.trim() ?? "" : "";
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
    const recents_data: Array<HompageData> = [];
    recents.forEach((item) => {
        let url = item.querySelector("a")?.getAttribute("href") ?? "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const imageElement = item.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const Title = item.querySelector(".text .name")?.textContent?.trim() ?? "";
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
    const populars_data: Array<HompageData> = [];
    populars.forEach((item) => {
        let url = item.querySelector("a")?.getAttribute("href") ?? "";
        url = url.replace("blkom.com/watch/", "blkom.com/anime/");
        const parts = url.split("/");
        parts.pop();
        url = parts.join("/");
        const imageElement = item.querySelector(".poster img");
        const imageUrl = imageElement ? `https://blkom.com${imageElement.getAttribute("data-original")}` : "";
        const Title = item.querySelector(".text .name")?.textContent?.trim() ?? "";
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

    sendResult(
        {
            action: "homepage",
            result,
        },
        true
    );
}
