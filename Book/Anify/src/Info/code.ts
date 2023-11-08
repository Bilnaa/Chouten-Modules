import { Manga, ChapterData, MediaStatus } from "../anify-types";

export {};

async function logic(payload: BasePayload) {
    const data: Manga = JSON.parse(await sendRequest(payload.query, {}));

    const titles = {
        primary: data.title?.english ?? data.title?.romaji ?? data.title?.native ?? "",
        secondary: data.title?.native ?? data.title?.romaji ?? data.title?.english ?? "",
    };

    const description = new DOMParser().parseFromString(data.description ?? "", "text/html").body.textContent ?? data.description ?? "";
    const poster = data.coverImage;

    const status = data.status;

    const totalMediaCount = data.totalChapters ?? 0;
    const seasons: { name: string; url: string }[] = [];

    const nextUrl = `https://api.anify.tv/chapters/${data.id}`;

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

async function getEpList(payload: BasePayload) {
    const data: ChapterData[] = JSON.parse(await sendRequest(payload.query, {}));

    const id = payload.query.split("/chapters/")[1].split("?apikey=")[0];

    const results: { title: string; list: { url: string; title: string; number: number }[] }[] = [];

    data.map((provider) => {
        results.push({
            title: provider.providerId,
            list: (provider.chapters ?? []).map((e) => {
                return {
                    url: `https://api.anify.tv/pages?providerId=${provider.providerId}&readId=${e.id}&chapterNumber=${e.number}&id=${id}`,
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
