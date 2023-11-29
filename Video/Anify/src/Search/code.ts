import { Anime } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: {
        results: Anime[];
        total: number;
        lastPage: number;
    } = JSON.parse(await sendRequest(`https://api.anify.tv/search?query=${encodeURIComponent(payload.query)}&type=anime`, {}));

    const titles: SearchData = [];

    console.log(data);

    for (let i = 0; i < data.results.length; i++) {
        const hasSub = true;
        const hasDub = true;
        const currentCount = data.results[i].episodes?.latest?.latestEpisode ?? 0;
        const totalCount = data.results[i].totalEpisodes ?? 0;

        titles.push({
            url: `https://api.anify.tv/info/${data.results[i].id}`,
            img: data.results[i].coverImage ?? "",
            title: data.results[i].title.english ?? data.results[i].title.romaji ?? data.results[i].title.native ?? "No Title Found",
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
