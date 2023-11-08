export {};

async function logic(payload: BasePayload) {
    const data = JSON.parse(await sendRequest(payload.query, {}));

    const titles = {
        primary: data.title?.english ?? data.title?.romaji ?? data.title?.native ?? "",
        secondary: data.title?.native ?? data.title?.romaji ?? data.title?.english ?? "",
    };

    const description = data.description;
    const poster = data.coverImage;

    const status = data.status;

    const totalMediaCount = data.totalEpisodes ?? 0;
    const seasons: any[] = [];

    const nextUrl = "https://api.anify.tv/episodes/" + data.id + "?apikey=a29078ed5ace232f708c0f2851530a61";

    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nextUrl],
            altTitles: [],
            description: description,
            poster: poster,
            status: status,
            totalMediaCount: parseInt(totalMediaCount),
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        action: "metadata",
    });
}

async function getEpList(payload: any) {
    const data = JSON.parse(await sendRequest(payload.query, {}));

    const results: any[] = [];

    data.map((provider: any) => {
        results.push({
            title: provider.providerId,
            list: (provider.episodes ?? []).map((e: any) => {
                return {
                    url: `https://api.anify.tv/sources?providerId=${provider.providerId}&watchId=${e.id}&episode=${e.episode}&id=${payload.query.split("/episodes/")[1].split("&apikey=")[0]}&subType=${"sub"}&apikey=a29078ed5ace232f708c0f2851530a61`,
                    title: e.title,
                    number: e.number,
                };
            }),
        });
    });

    sendResult(
        {
            result: results,
            action: "eplist",
        },
        true
    );
}
