export {};

async function logic(payload: BasePayload) {
    const servers: MediaDataResult[] = [];

    servers.push({
        title: "Video",
        list: []
    });

    servers[0].list.push({
        url: payload.query,
        name: "HLS"
    });

    sendResult({
        result: servers,
        action: "server"
    });
}


async function getSource(payload: BasePayload) {

    const sourceJSON = JSON.parse(await sendRequest(
        `https://hanime.tv/api/v8/video?id=${payload.query.split("/").pop()}`, {}
    ));

    const qualities: MediaQuality[] = [];

    sourceJSON.videos_manifest.servers[0].streams.map((elem: any) => {
        if(!elem.url){
            return;
        }
        
        qualities.push({
            quality: elem.height,
            file: elem.url,
            type: "hls"
        })
    });

    sendResult({
        result: {
            sources: qualities,
            subtitles: [],
            skips: []
        },
        action: "video",
    });
}