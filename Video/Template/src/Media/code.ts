async function logic(payload: BasePayload) {
    sendResult({
        result: [
            {
                list: [
                    {
                        url: "<url>",
                        name: "name",
                    },
                ],
                title: "Title",
            },
        ],
        action: "server",
    });
}

async function getSource(payload: BasePayload) {
    sendResult({
        result: {
            sources: [
                {
                    file: "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8",
                    type: "hls",
                    quality: "auto",
                },
            ],
            subtitles: [],
            skips: [],
            headers: {},
        },
        action: "video",
    });
}

export {};
