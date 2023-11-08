import { Anime, Seasonal } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: Seasonal = JSON.parse(await sendRequest("https://api.eltik.net/seasonal?type=anime&fields=[id,title,coverImage,description,season,episodes,totalEpisodes]", {}));

    function capitalize(s: string) {
        s = s.toLowerCase();
        return s && (s[0]?.toUpperCase() ?? "") + s.slice(1);
    }

    const seasonalData: Array<HompageData> = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];

        seasonalData.push({
            url: `https://api.eltik.net/info/${item.id}`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: new DOMParser().parseFromString(item.description ?? "", "text/html").body.textContent ?? item.description ?? "",
            subtitleValue: [],
            buttonText: "Watch Now",
            iconText: capitalize(item.season),
            showIcon: false,
            indicator: "Seasonal",
        });
    }

    const recents: Anime[] = JSON.parse(await sendRequest("https://api.eltik.net/recent?type=anime", {}));

    const recentData: Array<HompageData> = [];

    for (let i = 0; i < recents?.length; i++) {
        const item = recents[i];

        recentData.push({
            url: `https://api.eltik.net/info/${item.id}`,
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
            total: Number(item.totalEpisodes ?? 0),
        });
    }

    const trendingData: Array<HompageData> = [];

    for (let i = 0; i < data.trending?.length; i++) {
        const item = data.trending[i];

        trendingData.push({
            url: `https://api.eltik.net/info/${item.id}`,
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
            total: Number(item.totalEpisodes ?? 0),
        });
    }

    const topRatedData: Array<HompageData> = [];

    for (let i = 0; i < data.top?.length; i++) {
        const item = data.top[i];

        topRatedData.push({
            url: `https://api.eltik.net/info/${item.id}`,
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
            total: Number(item.totalEpisodes ?? 0),
        });
    }

    const result = [
        {
            type: "Carousel",
            title: "Seasonal",
            data: seasonalData,
        },
        {
            type: "list",
            title: "Recently Released",
            data: recentData,
        },
        {
            type: "grid_2x",
            title: "Currently Trending",
            data: trendingData,
        },
        {
            type: "grid_3x",
            title: "Highest Rated",
            data: topRatedData,
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
