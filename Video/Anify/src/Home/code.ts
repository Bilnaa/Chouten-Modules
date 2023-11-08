export {};

async function logic(payload: BasePayload) {
    const data = JSON.parse(await sendRequest("https://api.anify.tv/seasonal?type=anime&apikey=a29078ed5ace232f708c0f2851530a61", {}));

    const spotlight_data: Array<HompageData> = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];

        spotlight_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: item.description,
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: item.season,
            showIcon: false,
            indicator: "Spotlight",
        });
    }

    const recents = JSON.parse(await sendRequest("https://api.anify.tv/recent?type=anime&apikey=a29078ed5ace232f708c0f2851530a61", {}));

    const recents_data: Array<HompageData> = [];

    for (let i = 0; i < recents?.length; i++) {
        const item = recents[i];

        recents_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number(item.episodes?.latest?.latestEpisode ?? 0),
            total: Number(item.episodes?.latest?.totalEpisodes ?? 0),
        });
    }

    const new_data: Array<HompageData> = [];
    for (let i = 0; i < data.trending?.length; i++) {
        const item = data.trending[i];

        new_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number(item.episodes?.latest?.latestEpisode ?? 0),
            total: Number(item.episodes?.latest?.totalEpisodes ?? 0),
        });
    }

    const top_viewed_data: Array<HompageData> = [];
    for (let i = 0; i < data.top?.length; i++) {
        const item = data.top[i];

        top_viewed_data.push({
            url: `https://api.anify.tv/info/${item.id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.season,
            current: Number(item.episodes?.latest?.latestEpisode ?? 0),
            total: Number(item.episodes?.latest?.totalEpisodes ?? 0),
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
            title: "Currently Trending",
            data: new_data,
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
