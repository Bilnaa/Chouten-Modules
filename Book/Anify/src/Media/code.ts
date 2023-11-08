import { Page } from "../anify-types";

async function logic(payload: BasePayload) {
    const data: Page[] = JSON.parse(await sendRequest(payload.query, {}));

    const images: MediaChapter[] = data.map((e) => {
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

export {};
