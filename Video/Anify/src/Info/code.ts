import { Anime, EpisodeData, MediaStatus } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: Anime = JSON.parse(await sendRequest(payload.query, {}));

    const titles = {
        primary: data.title?.english ?? data.title?.romaji ?? data.title?.native ?? "",
        secondary: data.title?.native ?? data.title?.romaji ?? data.title?.english ?? "",
    };

    const description = new DOMParser().parseFromString(data.description ?? "", "text/html").body.textContent ?? data.description ?? "";
    const poster = data.coverImage;

    const status = data.status;

    const totalMediaCount = data.totalEpisodes ?? 0;
    const seasons: { name: string; url: string }[] = [];

    const nextUrl = "https://api.anify.tv/episodes/" + data.id + "?apikey=a29078ed5ace232f708c0f2851530a61";

    function capitalize(s: string) {
        s = s.toLowerCase();
        return s && (s[0]?.toUpperCase() ?? "") + s.slice(1);
    }

    function parseStatus(status: MediaStatus) {
        return status === MediaStatus.NOT_YET_RELEASED ? "Not released" : capitalize(status);
    }

    sendResult({
        result: {
            id: "",
            titles: titles,
            epListURLs: [nextUrl],
            altTitles: data.synonyms ?? [],
            description: description,
            poster: poster,
            banner: data.bannerImage ?? poster ?? "",
            status: parseStatus(status ?? MediaStatus.NOT_YET_RELEASED),
            totalMediaCount,
            mediaType: "Episodes",
            seasons: seasons,
            mediaList: [],
        },
        action: "metadata",
    });
}

async function getEpList(payload: any) {
    const data: EpisodeData[] = JSON.parse(await sendRequest(payload.query, {}));

    const results: { title: string; list: { url: string; title: string; number: number }[] }[] = [];

    data.map((provider) => {
        results.push({
            title: provider.providerId,
            list: (provider.episodes ?? []).map((e) => {
                return {
                    url: `https://api.anify.tv/sources?providerId=${provider.providerId}&watchId=${e.id}&episode=${e.number}&id=${payload.query.split("/episodes/")[1].split("&apikey=")[0]}&subType=${"sub"}&apikey=a29078ed5ace232f708c0f2851530a61`,
                    title: e.title,
                    number: e.number,
                    image: e.img ?? "",
                    isFiller: e.isFiller,
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
