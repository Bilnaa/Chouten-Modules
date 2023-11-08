"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
    const data = JSON.parse(await sendRequest(payload.query, {}));
    const images = data.map((e) => {
        return {
            id: `page-${e.index}`,
            image: e.url,
        };
    });
    sendResult({
        result: {
            images: images,
        },
        action: "chapter",
    });
}
