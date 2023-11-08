export {};

async function logic(payload: BasePayload) {
    const servers: MediaDataResult[] = [];

    servers.push({
        title: "Sub",
        list: [{ url: String(payload.query), name: "Sub" }],
    });

    sendResult({
        result: servers,
        action: "server",
    });
}

async function getSource(payload: any) {
    const data = JSON.parse(await sendRequest(payload.query, {}));

    sendResult(
        {
            result: {
                skips: [
                    {
                        start: data.intro.start,
                        end: data.intro.end,
                        type: "Opening",
                    },
                    {
                        start: data.outro.start,
                        end: data.outro.end,
                        type: "Ending",
                    },
                ],
                sources: data.sources.map((source: any) => {
                    return {
                        file: source.url,
                        type: "hls",
                        quality: source.quality,
                    };
                }),
                subtitles: data.subtitles.map((subtitle: any) => {
                    return {
                        url: subtitle.url,
                        language: subtitle.lang,
                    };
                }),
                headers: data.headers,
            },
            action: "video",
        },
        true
    );
}
