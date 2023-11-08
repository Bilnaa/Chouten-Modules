"use strict";
function generateEncryptedAjaxParams(scriptValue, id, keys) {
    const encryptedKey = CryptoJS.AES.encrypt(id, keys[0], {
        iv: keys[2],
    });
    const decryptedToken = CryptoJS.AES.decrypt(scriptValue, keys[0], {
        iv: keys[2],
    }).toString(CryptoJS.enc.Utf8);
    return `id=${encryptedKey}&alias=${id}&${decryptedToken}`;
}
function decryptAjaxData(encryptedData, keys) {
    const decryptedData = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedData, keys[1], {
        iv: keys[2],
    }));
    return JSON.parse(decryptedData);
}
async function logic(payload) {
    var _a;
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
    const watchHTML = await sendRequest(payload.query, {});
    const watchDOM = new DOMParser().parseFromString(watchHTML, "text/html");
    let videoURLTemp = watchDOM.querySelector("#load_anime iframe").getAttribute("src");
    const keys = [CryptoJS.enc.Utf8.parse("37911490979715163134003223491201"), CryptoJS.enc.Utf8.parse("54674138327930866480207815084989"), CryptoJS.enc.Utf8.parse("3134003223491201")];
    if (videoURLTemp.substring(0, 2) === "//") {
        videoURLTemp = "https:" + videoURLTemp;
    }
    const embedHTML = await sendRequest(videoURLTemp, {});
    const videoURL = new URL(videoURLTemp);
    const encyptedParams = generateEncryptedAjaxParams(embedHTML.split("data-value")[1].split('"')[1], (_a = videoURL.searchParams.get("id")) !== null && _a !== void 0 ? _a : "", keys);
    const encryptedData = JSON.parse(await sendRequest(`${videoURL.protocol}//${videoURL.hostname}/encrypt-ajax.php?${encyptedParams}`, {
        "X-Requested-With": "XMLHttpRequest",
    }));
    const decryptedData = decryptAjaxData(encryptedData.data, keys);
    const servers = [];
    servers.push({
        title: "Video",
        list: [],
    });
    for (const source of decryptedData.source) {
        servers[0].list.push({
            url: source.file,
            name: "HLS",
        });
    }
    console.log(JSON.stringify({
        result: servers,
        action: "server",
    }));
    sendResult({
        result: servers,
        action: "server",
    });
}
function extractAndConcatenateString(originalString, stops) {
    let decryptedKey = "";
    let offset = 0;
    let encryptedString = originalString;
    for (const i in stops) {
        const start = stops[i][0];
        const end = stops[i][1];
        decryptedKey += encryptedString.slice(start - offset, end - offset);
        encryptedString = encryptedString.slice(0, start - offset) + encryptedString.slice(end - offset);
        offset += end - start;
    }
    return {
        dec_key: decryptedKey,
        enc_string: encryptedString,
    };
}
function getFile(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    }
    else {
        return null;
    }
}
async function getSource(payload) {
    const manifestUrl = payload.query;
    const resResult = await sendRequest(manifestUrl, {});
    let qualities = [];
    qualities.push({ quality: "auto", file: manifestUrl, type: "hls" });
    const resolutions = resResult.split("\\n\\n")[0].match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);
    resolutions === null || resolutions === void 0 ? void 0 : resolutions.forEach((res) => {
        const index = manifestUrl.lastIndexOf("/");
        const quality = res.split("\n")[0].split("x")[1].split(",")[0];
        const url = manifestUrl.slice(0, index);
        qualities.push({
            file: url + "/" + res.split("\n")[1].replace("/", ""),
            type: "hls",
            quality: quality + "p",
        });
    });
    const uniqueAuthors = qualities.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item.quality === current.quality)) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);
    qualities = uniqueAuthors.map((item) => item);
    sendResult({
        result: {
            sources: qualities,
            subtitles: [],
            skips: [],
        },
        action: "video",
    });
}
