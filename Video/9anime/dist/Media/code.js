"use strict";
const baseURL = "https://aniwave.to";
async function getVRF(query, action) {
    const nineAnimeURL = "9anime.eltik.net";
    let reqURL = `https://${nineAnimeURL}/${action}?query=${encodeURIComponent(query)}&apikey=${"enimax"}`;
    const source = await sendRequest(reqURL, {});
    try {
        const parsedJSON = JSON.parse(source);
        if (parsedJSON.url) {
            return parsedJSON.url;
        }
        else {
            throw new Error(`${action}-VRF1: Received an empty URL or the URL was not found.`);
        }
    }
    catch (err) {
        throw new Error(`${action}-VRF1: Could not parse the JSON correctly.`);
    }
}
async function reconstructM3u8File(file, isViz) {
    const m3u8FileArray = (await sendRequest(file, {
        "referer": isViz ? "https://vidstream.pro/" : "https://mcloud.to/",
        "x-requested-with": "XMLHttpRequest"
    })).split("\n");
    let shouldReplace = false;
    for (let i = 0; i < m3u8FileArray.length; i++) {
        if (m3u8FileArray[i].startsWith("#EXTINF")) {
            shouldReplace = true;
        }
        else if (shouldReplace) {
            m3u8FileArray[i] = (new URL(m3u8FileArray[i], file)).toString();
            shouldReplace = false;
        }
    }
    return `data:application/x-mpegURL;base64,${btoa(m3u8FileArray.join("\n"))}`;
}
async function getVidstreamLink(query, isViz = true) {
    var _a, _b, _c, _d;
    const nineAnimeURL = "9anime.eltik.net";
    const apiKey = "enimax";
    const reqURL = `https://${nineAnimeURL}/raw${isViz ? "Vizcloud" : "Mcloud"}?query=${encodeURIComponent(query)}&apikey=${apiKey}`;
    const futoken = await sendRequest("https://vidstream.pro/futoken", {});
    const rawSource = JSON.parse(await sendRequest(reqURL, {
        "Content-Type": "application/x-www-form-urlencoded"
    }, "POST", new URLSearchParams({
        query,
        futoken
    }).toString())).rawURL;
    console.log(rawSource);
    const source = await sendRequest(rawSource, {
        "referer": isViz ? "https://vidstream.pro/" : "https://mcloud.to/",
        "x-requested-with": "XMLHttpRequest"
    });
    console.log(source);
    try {
        const parsedJSON = JSON.parse(source);
        const manifestUrl = (_b = (_a = parsedJSON === null || parsedJSON === void 0 ? void 0 : parsedJSON.result) === null || _a === void 0 ? void 0 : _a.sources[0]) === null || _b === void 0 ? void 0 : _b.file;
        if ((_d = (_c = parsedJSON === null || parsedJSON === void 0 ? void 0 : parsedJSON.result) === null || _c === void 0 ? void 0 : _c.sources[0]) === null || _d === void 0 ? void 0 : _d.file) {
            const manifestFile = await sendRequest(parsedJSON.result.sources[0].file, { referer: "https://vidstream.pro/" });
            const resolutions = manifestFile.split("\\n\\n")[0].match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);
            const qualities = [];
            for (const res of resolutions) {
                const quality = res.split('\n')[0].split('x')[1].split(',')[0];
                const reconstructedFile = await reconstructM3u8File((new URL(res.split('\n')[1], manifestUrl)).toString(), isViz);
                console.log(reconstructedFile);
                qualities.push({
                    file: reconstructedFile,
                    type: "hls",
                    quality: quality + 'p',
                });
            }
            return qualities;
        }
        else {
            throw new Error("VIZCLOUD1: Received an empty URL or the URL was not found.");
        }
    }
    catch (err) {
        throw new Error("VIZCLOUD0: Could not parse the JSON correctly.");
    }
}
// getFilemoonLink: async function (filemoonHTML: string) {
//     let fallbackAPI = false;
//     let nineAnimeURL = "9anime.eltik.net";
//     let apiKey = "enimax";
//     try {
//         this.checkConfig();
//         nineAnimeURL = localStorage.getItem("9anime").trim();
//         apiKey = localStorage.getItem("apikey").trim();
//         fallbackAPI = false;
//     } catch (err) {
//         console.warn("Defaulting to Consumet.");
//     }
//     let reqURL = `https://${nineAnimeURL}/filemoon?apikey=${apiKey}`;
//     if (fallbackAPI) {
//         throw new Error("Not supported");
//     }
//     const source = await MakeFetch(reqURL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: new URLSearchParams({
//             "query": filemoonHTML
//         })
//     });
//     try {
//         const parsedJSON = JSON.parse(source);
//         if (parsedJSON.url) {
//             return parsedJSON.url;
//         } else {
//             throw new Error("FILEMOON1: Received an empty URL or the URL was not found.");
//         }
//     } catch (err) {
//         throw new Error("FILEMOON0: Could not parse the JSON correctly.");
//     }
// },
async function decryptSource(query) {
    const nineAnimeURL = "9anime.eltik.net";
    let reqURL = `https://${nineAnimeURL}/decrypt?query=${encodeURIComponent(query)}&apikey=${"enimax"}`;
    const source = await sendRequest(reqURL, {});
    try {
        const parsedJSON = JSON.parse(source);
        if (parsedJSON.url) {
            return parsedJSON.url;
        }
        else {
            throw new Error("DECRYPT1: Received an empty URL or the URL was not found.");
        }
    }
    catch (err) {
        throw new Error("DECRYPT0: Could not parse the JSON correctly.");
    }
}
async function logic(payload) {
    var _a, _b, _c, _d;
    const serverHTML = JSON.parse(await sendRequest(`${baseURL}/ajax/server/list/${payload.query}?vrf=${encodeURIComponent(await getVRF(payload.query, "vrf"))}`, {})).result;
    const serverDOM = (new DOMParser()).parseFromString(serverHTML, "text/html");
    const allServers = serverDOM.querySelectorAll("li");
    const servers = [];
    servers.push({
        title: "Video",
        list: []
    });
    const supportedServers = ["vidstream", "mycloud"];
    for (let i = 0; i < allServers.length; i++) {
        let currentServer = allServers[i];
        let type = i.toString();
        try {
            const tempType = (_c = (_b = (_a = currentServer === null || currentServer === void 0 ? void 0 : currentServer.parentElement) === null || _a === void 0 ? void 0 : _a.previousElementSibling) === null || _b === void 0 ? void 0 : _b.innerText) === null || _c === void 0 ? void 0 : _c.trim();
            if (tempType) {
                type = tempType;
            }
        }
        catch (err) {
            console.warn(err);
        }
        const serverName = currentServer.innerText.toLowerCase();
        if (supportedServers.includes(serverName)) {
            servers[0].list.push({
                url: (_d = currentServer.getAttribute("data-link-id")) !== null && _d !== void 0 ? _d : "",
                name: `${serverName}-${type}`
            });
        }
    }
    sendResult({
        result: servers,
        action: "server"
    });
}
async function addSource(query, index, extractor = "vidstream") {
    const serverVRF = await getVRF(query, "vrf");
    const serverData = JSON.parse(await sendRequest(`${baseURL}/ajax/server/${query}?vrf=${encodeURIComponent(serverVRF)}`, {})).result;
    const serverURL = serverData.url;
    const sourceDecrypted = await decryptSource(serverURL);
    let source = [];
    if (extractor == "vidstream") {
        const vidstreamID = sourceDecrypted.split("/").pop();
        source.push(...await getVidstreamLink(vidstreamID, true));
    }
    else if (extractor == "filemoon") {
        // const filemoonHTML = await MakeFetch(sourceDecrypted);
        // const m3u8File = await self.getFilemoonLink(filemoonHTML);
        // source = {
        //     "name": "Filemoon#" + index,
        //     "type": m3u8File.includes(".m3u8") ? "hls" : "mp4",
        //     "url": m3u8File,
        // };
    }
    else {
        const mCloudID = sourceDecrypted.split("/").pop();
        source.push(...await self.getVidstreamLink(mCloudID, false));
    }
    return source;
    // if ("skip_data" in serverData) {
    //     serverData.skip_data = JSON.parse(await self.decryptSource(serverData.skip_data));
    //     source.skipIntro = {
    //         start: serverData.skip_data.intro[0],
    //         end: serverData.skip_data.intro[1]
    //     };
    // }
}
async function getSource(payload) {
    const serverID = payload.query;
    const sources = await addSource(serverID, "");
    sendResult({
        result: {
            sources: sources,
            subtitles: [],
            skips: []
        },
        action: "video",
    });
}
