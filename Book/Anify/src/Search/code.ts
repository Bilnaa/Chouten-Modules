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
        const currentCount = data[i].chapters?.latest?.latestChapter ?? 0;
        const totalCount = data[i].totalChapters ?? 0;

        titles.push({
            url: `https://api.anify.tv/info/${data[i].id}`,
            img: data[i].coverImage ?? "",
            title: data[i].title.english ?? data[i].title.romaji ?? data[i].title.native ?? "No Title Found",
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
