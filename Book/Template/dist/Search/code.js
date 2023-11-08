"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    sendResult({
        action: "search",
        result: Array(10).fill({
            url: "<url>",
            img: "https://www.picsum.photos/1000",
            title: "Title",
            indicatorText: "Indicator text",
            currentCount: 10,
            totalCount: 100,
        }),
    });
}
