"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    const servers = [];
    servers.push({
        title: "Sub",
        list: [{ url: String(payload.query), name: "Sub" }],
    });
    sendResult({
        result: servers,
        action: "server",
    });
}
async function getSource(payload) {
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const subtitles = [];
    data.subtitles.map((subtitle) => {
        if (subtitle.lang.toLowerCase() === "thumbnails") {
            return [];
        }
        subtitles.push({
            url: subtitle.url,
            language: subtitle.lang,
        });
    }),
        sendResult({
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
                sources: data.sources.map((source) => {
                    return {
                        file: source.url,
                        type: "hls",
                        quality: source.quality,
                    };
                }),
                subtitles: subtitles,
                headers: data.headers,
            },
            action: "video",
        }, true);
}
