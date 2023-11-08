export {};

const baseURL = "https://blkom.com";

async function logic(payload: BasePayload) {
    const serverHTML = await sendRequest(payload.query, {});
    const serverDOM = new DOMParser().parseFromString(serverHTML, "text/html");
    const serverElements = serverDOM.querySelectorAll(".server a");
    const servers: MediaDataResult[] = [];

    servers.push({
        title: "Video",
        list: [],
    });

    try {
        let blkomServerLink = "";

        serverElements.forEach((serverElement) => {
            const serverName = serverElement.textContent?.trim();
            if (serverName === "Blkom") {
                blkomServerLink = serverElement.getAttribute("data-src") || "";
            }
        });

        if (!blkomServerLink) {
            throw new Error("Blkom server link not found");
        }
        servers[0].list.push({
            url: blkomServerLink,
            name: "Blkom",
        });
    } catch (err: any) {
        throw new Error("Failed to fetch or parse server data: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    sendResult({
        result: servers,
        action: "server",
    });
}

async function getSource(payload: BasePayload) {
    const serverInfo = await sendRequest(payload.query, {});
    const serverDOM = new DOMParser().parseFromString(serverInfo, "text/html");
    const videoElement = serverDOM.getElementById("video");
    const sourceElements = videoElement?.querySelectorAll("source");
    const sourceQualities: MediaQuality[] = [];

    if (sourceElements) {
        sourceElements.forEach((sourceElement) => {
            const quality: string | null = sourceElement.getAttribute("label");
            const sourceURL: string | null = sourceElement.getAttribute("src");

            if (quality !== null && sourceURL !== null) {
                sourceQualities.push({
                    quality: quality,
                    file: sourceURL,
                    type: "mp4",
                });
            }
        });
    }
    sourceQualities.reverse();

    console.log({
        sources: sourceQualities,
        subtitles: [],
        skips: [],
        headers: {},
    });

    sendResult({
        result: {
            sources: sourceQualities,
            subtitles: [],
            skips: [],
            headers: {},
        },
        action: "video",
    });
}
