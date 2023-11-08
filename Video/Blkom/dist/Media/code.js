"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseURL = "https://blkom.com";
async function logic(payload) {
    const serverHTML = await sendRequest(payload.query, {});
    const serverDOM = new DOMParser().parseFromString(serverHTML, "text/html");
    const serverElements = serverDOM.querySelectorAll(".server a");
    const servers = [];
    servers.push({
        title: "Video",
        list: [],
    });
    try {
        let blkomServerLink = "";
        serverElements.forEach((serverElement) => {
            var _a;
            const serverName = (_a = serverElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
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
    }
    catch (err) {
        throw new Error("Failed to fetch or parse server data: " + (err instanceof Error ? err.message : "Unknown error"));
    }
    sendResult({
        result: servers,
        action: "server",
    });
}
async function getSource(payload) {
    const serverInfo = await sendRequest(payload.query, {});
    const serverDOM = new DOMParser().parseFromString(serverInfo, "text/html");
    const videoElement = serverDOM.getElementById("video");
    const sourceElements = videoElement === null || videoElement === void 0 ? void 0 : videoElement.querySelectorAll("source");
    const sourceQualities = [];
    if (sourceElements) {
        sourceElements.forEach((sourceElement) => {
            const quality = sourceElement.getAttribute("label");
            const sourceURL = sourceElement.getAttribute("src");
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
