import { Anime } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: {
        results: Anime[],
        total: number,
        lastPage: number
    } = JSON.parse(await sendRequest(`https://api.anify.tv/search?query=${encodeURIComponent(payload.query)}&type=anime`, {}));

    const titles: SearchData = [];

    for (let i = 0; i < data.results.length; i++) {
        const hasSub = true;
        const hasDub = true;
        const currentCount = data[i].episodes?.latest?.latestEpisode ?? 0;
        const totalCount = data[i].totalEpisodes ?? 0;

        titles.push({
            url: `https://api.anify.tv/info/${data[i].id}`,
            img: data[i].coverImage ?? "",
            title: data[i].title.english ?? data[i].title.romaji ?? data[i].title.native ?? "No Title Found",
            indicatorText: `${hasSub ? "Sub" : ""}${hasSub && hasDub ? "|" : ""}${hasDub ? "Dub" : ""}`,
            currentCount,
            totalCount,
        });
    }

    sendResult({
        action: "search",
        result: titles,
    });
}
