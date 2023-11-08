async function logic(payload: BasePayload) {
    const infoJSON = JSON.parse(await sendRequest(
        `https://hanime.tv/api/v8/video?id=${payload.query.split("/").pop()}`, {}
    ));

    const description = (new DOMParser()).parseFromString(infoJSON?.hentai_video?.description ?? "", "text/html").documentElement.innerText;

    sendResult({
        result: {
            id: "",
            titles: {
                primary: infoJSON?.hentai_video?.name ?? infoJSON?.hentai_video?.slug ?? "",
                secondary: ""
            },
            epListURLs: [
                payload.query
            ],
            altTitles: [],
            description: description ?? "",
            poster: infoJSON?.hentai_video?.poster_url ?? "",
            status: "",
            totalMediaCount: 1,
            mediaType: "Episodes",
            seasons: [],
            mediaList: []
        },
        action: "metadata",
    });
}


async function getEpList(payload: BasePayload) {
    const infoJSON = JSON.parse(await sendRequest(
        `https://hanime.tv/api/v8/video?id=${payload.query.split("/").pop()}`, {}
    ));

    sendResult({
        result: [{
            title: "Season 1",
            list: [{
                url: payload.query,
                number: 1,
                title: infoJSON?.hentai_video?.name ?? infoJSON?.hentai_video?.slug ?? ""
            }]
        }],
        action: "eplist"
    }, true);
}
