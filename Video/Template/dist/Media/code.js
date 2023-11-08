"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
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
async function getSource(payload) {
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
