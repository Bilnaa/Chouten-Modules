async function logic(payload: BasePayload) {
    const baseURL = "https://gogoanime.hu";

    const html = await sendRequest(`https://ajax.gogo-load.com/ajax/page-recent-release-ongoing.html?page=1`, {});
    const DOMParserInstance = new DOMParser();
    const DOM = DOMParserInstance.parseFromString(html, "text/html");

    const items = Array.from(DOM?.querySelector(".added_series_body.popular")?.querySelectorAll("li") ?? []).map((elem) => {
        const current = Array.from(elem?.querySelectorAll("a") ?? [])?.pop()?.innerText ?? "";

        return {
            url: `${baseURL}${elem?.querySelector("a")?.getAttribute("href") ?? ""}`,
            titles: {
                primary: elem?.querySelector("a")?.getAttribute("title") ?? "",
            },
            image: elem?.querySelector<HTMLElement>(".thumbnail-popular")?.getAttribute("style")?.split("'")[1] ?? "",
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "Watch Now",
            indicator: "",
            current: isNaN(parseInt(current)) ? null : parseInt(current),
            total: null,
        };
    });

    const spotlight_data = [];

    try {
        spotlight_data.push(items.pop());
        spotlight_data.push(items.pop());
        spotlight_data.push(items.pop());

        for (const data of spotlight_data) {
            data!.indicator = "Spotlight";
        }
    } catch (err) {}

    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data,
        },
        {
            type: "grid_2x",
            title: "Recently Released",
            data: items,
        },
    ] as HomepageFinalData[];

    console.log(result);

    sendResult(
        {
            action: "homepage",
            result,
        },
        true
    );
}
