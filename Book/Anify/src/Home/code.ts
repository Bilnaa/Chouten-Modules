import { Manga, Seasonal } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: Seasonal = JSON.parse(await sendRequest("https://api.anify.tv/seasonal?type=manga&fields=[id,description,bannerImage,coverImage,title,genres,format,averageRating,chapters,year,type]", {}));

    function capitalize(s: string) {
        s = s.toLowerCase();
        return s && (s[0]?.toUpperCase() ?? "") + s.slice(1);
    }

    const seasonalData: Array<HompageData> = [];
    for (let i = 0; i < data.seasonal.length; i++) {
        const item = data.seasonal[i];

        seasonalData.push({
            url: `https://api.anify.tv/info/${item.id}`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: new DOMParser().parseFromString(item.description ?? "", "text/html").body.textContent ?? item.description ?? "",
            subtitleValue: [],
            buttonText: "Read Now",
            iconText: item.year + "",
            showIcon: false,
            indicator: "Seasonal",
        });
    }

    const recents: Manga[] = JSON.parse(await sendRequest("https://api.anify.tv/recent?type=manga", {}));

    const recentData: Array<HompageData> = [];

    for (let i = 0; i < recents?.length; i++) {
        const item = recents[i];

        recentData.push({
            url: `https://api.anify.tv/info/${item.id}`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.year + "",
            current: Number(item.chapters?.latest?.latestChapter ?? 0),
            total: Number(item.totalChapters ?? 0),
        });
    }

    const trendingData: Array<HompageData> = [];

    for (let i = 0; i < data.trending?.length; i++) {
        const item = data.trending[i];

        trendingData.push({
            url: `https://api.anify.tv/info/${item.id}`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.year + "",
            current: Number(item.chapters?.latest?.latestChapter ?? 0),
            total: Number(item.totalChapters ?? 0),
        });
    }

    const topRatedData: Array<HompageData> = [];

    for (let i = 0; i < data.top?.length; i++) {
        const item = data.top[i];

        topRatedData.push({
            url: `https://api.anify.tv/info/${item.id}`,
            titles: {
                primary: item.title.english ?? item.title.romaji ?? item.title.native ?? "",
                secondary: item.title.native ?? item.title.romaji ?? item.title.english ?? "",
            },
            image: item.coverImage,
            subtitle: "",
            subtitleValue: [],
            showIcon: false,
            buttonText: "",
            indicator: item.year + "",
            current: Number(item.chapters?.latest?.latestChapter ?? 0),
            total: Number(item.totalChapters ?? 0),
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
