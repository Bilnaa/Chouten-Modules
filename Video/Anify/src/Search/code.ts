export {};

async function logic(payload: BasePayload) {
    const data = JSON.parse(await sendRequest(`https://api.anify.tv/search?query=${encodeURIComponent(payload.query)}&type=anime&apikey=a29078ed5ace232f708c0f2851530a61`, {}));

    const titles: SearchData = [];

    for (let i = 0; i < data.length; i++) {
        const hasSub = true;
        const hasDub = true;
        const currentCount = data[i].episodes?.latest?.latestEpisode ?? 0;
        const totalCount = data[i].totalEpisodes ?? 0;

        titles.push({
            url: `https://api.anify.tv/info/${data[i].id}?apikey=a29078ed5ace232f708c0f2851530a61`,
            img: data[i].coverImage,
            title: data[i].title.english ?? data[i].title.romaji ?? data[i].title.native,
            indicatorText: `${hasSub ? "Sub" : ""}${hasSub && hasDub ? "|" : ""}${hasDub ? "Dub" : ""}`,
            currentCount: parseInt(currentCount),
            totalCount: parseInt(totalCount),
        });
    }

    sendResult({
        action: "search",
        result: titles,
    });
}
