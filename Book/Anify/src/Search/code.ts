import { Manga } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: {
        results: Manga[];
        total: number;
        lastPage: number;
    } = JSON.parse(await sendRequest(`https://api.anify.tv/search?query=${encodeURIComponent(payload.query)}&type=manga`, {}));

    const titles: SearchData = [];

    for (let i = 0; i < data.results.length; i++) {
        const currentCount = data.results[i].chapters?.latest?.latestChapter ?? 0;
        const totalCount = data.results[i].totalChapters ?? 0;

        titles.push({
            url: `https://api.anify.tv/info/${data.results[i].id}`,
            img: data.results[i].coverImage ?? "",
            title: data.results[i].title.english ?? data.results[i].title.romaji ?? data.results[i].title.native ?? "No Title Found",
            indicatorText: `${currentCount}/${totalCount}`,
            currentCount,
            totalCount,
        });
    }

    sendResult({
        action: "search",
        result: titles,
    });
}
