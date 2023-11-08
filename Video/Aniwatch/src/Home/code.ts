export {};

async function logic(payload: BasePayload) {
    const html = await sendRequest("https://aniwatch.to/home", {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");

    const top = DOM.querySelector(".deslide-wrap")!;
    const spotlights = top.querySelectorAll<HTMLElement>(".deslide-item");

    const spotlight_data: Array<HompageData> = [];
    for (let i = 0; i < spotlights.length; i++) {
        const item = spotlights[i];

        spotlight_data.push({
            url: `https://aniwatch.to${item.querySelector<HTMLElement>(".desi-buttons > .btn.btn-secondary.btn-radius")!.getAttribute("href")}`,
            titles: {
                primary: item.querySelector<HTMLElement>(".desi-head-title.dynamic-name")?.innerText,
                secondary: item.querySelector<HTMLElement>(".desi-head-title.dynamic-name")?.getAttribute("data-jname") ?? "",
            },
            image: item.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("data-src") ?? "",
            subtitle: item.querySelector<HTMLElement>(".desi-description")?.innerText.trim(),
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: item.querySelector<HTMLElement>(".sc-detail > div:nth-child(1)")?.innerText.trim(),
            showIcon: false,
            indicator: "Spotlight",
        });
    }

    const recents_wrapper = DOM.querySelector("#main-content > section:nth-child(2)")?.querySelector(".film_list-wrap");
    const recents = recents_wrapper!.querySelectorAll(".flw-item");

    const recents_data: Array<HompageData> = [];
    for (let i = 0; i < recents?.length; i++) {
        const item = recents[i];

        recents_data.push({
            url: `https://aniwatch.to${item.querySelector<HTMLElement>(".dynamic-name")!.getAttribute("href")}`,
            titles: {
                primary: item.querySelector<HTMLElement>(".dynamic-name")?.innerText,
            },
            image: item.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("data-src") ?? "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.querySelector<HTMLElement>(".tick-rate")?.innerText ?? "",
            current: item.querySelector<HTMLElement>(".tick-sub") != null ? parseInt(item.querySelector<HTMLElement>(".tick-sub")?.innerText ?? "") : null,
            total: item.querySelector<HTMLElement>(".tick-eps") != null ? parseInt(item.querySelector<HTMLElement>(".tick-eps")?.innerText ?? "") : null,
        });
    }
    const new_wrapper = DOM.querySelector("#main-content > section:nth-child(5)")?.querySelector(".film_list-wrap");
    const new_list = new_wrapper!.querySelectorAll(".flw-item");

    const new_data: Array<HompageData> = [];
    for (let i = 0; i < new_list?.length; i++) {
        const item = new_list[i];

        new_data.push({
            url: `https://aniwatch.to${item.querySelector<HTMLElement>(".dynamic-name")?.getAttribute("href")}`,
            titles: {
                primary: item.querySelector<HTMLElement>(".dynamic-name")?.innerText,
            },
            image: item.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("data-src") ?? "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.querySelector<HTMLElement>(".tick-rate")?.innerText ?? "",
            current: item.querySelector(".tick-sub") != null ? parseInt(item.querySelector<HTMLElement>(".tick-sub")?.innerText ?? "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt(item.querySelector<HTMLElement>(".tick-eps")?.innerText ?? "") : null,
        });
    }
    // #main-content > section:nth-child(8)
    const upcoming_wrapper = DOM.querySelector("#main-content > section:nth-child(8)")?.querySelector(".film_list-wrap");
    const upcoming_list = upcoming_wrapper!.querySelectorAll(".flw-item");

    const upcoming_data: Array<HompageData> = [];
    for (let i = 0; i < upcoming_list?.length; i++) {
        const item = upcoming_list[i];

        upcoming_data.push({
            url: `https://aniwatch.to${item.querySelector<HTMLElement>(".dynamic-name")?.getAttribute("href")}`,
            titles: {
                primary: item.querySelector<HTMLElement>(".dynamic-name")?.innerText,
            },
            image: item.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("data-src") ?? "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.querySelector<HTMLElement>(".tick-rate")?.innerText ?? "",
            current: item.querySelector(".tick-sub") != null ? parseInt(item.querySelector<HTMLElement>(".tick-sub")?.innerText ?? "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt(item.querySelector<HTMLElement>(".tick-eps")?.innerText ?? "") : null,
        });
    }

    const top_viewed_wrapper = DOM.querySelector("#top-viewed-day");
    const top_viewed_list = top_viewed_wrapper!.querySelectorAll("li");

    const top_viewed_data: Array<HompageData> = [];
    for (let i = 0; i < top_viewed_list?.length; i++) {
        const item = top_viewed_list[i];

        top_viewed_data.push({
            url: `https://aniwatch.to${item.querySelector<HTMLElement>(".dynamic-name")?.getAttribute("href")}`,
            titles: {
                primary: item.querySelector<HTMLElement>(".dynamic-name")?.innerText,
            },
            image: item.querySelector<HTMLElement>(".film-poster-img")?.getAttribute("data-src") ?? "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.querySelector<HTMLElement>(".fdi-item.ml-2")?.innerText + " Views",
            current: item.querySelector(".tick-sub") != null ? parseInt(item.querySelector<HTMLElement>(".tick-sub")?.innerText ?? "") : null,
            total: item.querySelector(".tick-eps") != null ? parseInt(item.querySelector<HTMLElement>(".tick-eps")?.innerText ?? "") : null,
        });
    }

    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data,
        },
        {
            type: "list",
            title: "Recently Released",
            data: recents_data,
        },
        {
            type: "grid_2x",
            title: "Now on Zoro",
            data: new_data,
        },
        {
            type: "list",
            title: "Top Upcoming",
            data: upcoming_data,
        },
        {
            type: "grid_3x",
            title: "Most Viewed",
            data: top_viewed_data,
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
