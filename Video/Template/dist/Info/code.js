"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    sendResult({
        result: {
            id: "",
            titles: {
                primary: "Title",
                secondary: "",
            },
            epListURLs: ["nextURL"],
            altTitles: [],
            description: "Description",
            poster: `https://picsum.photos/1000`,
            status: "Status",
            totalMediaCount: 10,
            mediaType: "Episodes",
            seasons: [],
            mediaList: [],
            banner: null,
        },
        action: "metadata",
    });
}
async function getEpList(payload) {
    sendResult({
        result: [
            {
                title: "Season 1",
                list: Array(10).fill({
                    url: "<url>",
                    title: "Episode title",
                    number: 1,
                }),
            },
        ],
        action: "eplist",
    }, true);
}
