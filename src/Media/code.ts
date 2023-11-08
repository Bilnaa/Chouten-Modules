async function logic(payload: string = "") {

    const response = JSON.parse(await sendRequest(payload, {}));

    const document = (new DOMParser()).parseFromString(response.html, "text/html");

    const subServers = document.querySelector(
        ".ps_-block.ps_-block-sub.servers-sub"
    )!;

    const dubServers = document.querySelector(
        ".ps_-block.ps_-block-sub.servers-dub"
    );

    let elements = subServers.querySelectorAll<HTMLElement>(".server-item");
    const servers: MediaDataResult[] = [];
    const subServersList = [];
    const dubServersList = [];

    for (let i = 0; i < elements.length; i++) {
        console.log(elements[i].innerText);
        subServersList.push({
            url:
                "https://aniwatch.to/ajax/v2/episode/sources?id=" +
                elements[i].getAttribute("data-id"),
            name: elements[i].innerText + " (Sub)",
        });
    }

    if (dubServers != null) {
        elements = dubServers.querySelectorAll(".server-item");
        for (let i = 0; i < elements.length; i++) {
            console.log(elements[i].innerText);
            dubServersList.push({
                url:
                    "https://aniwatch.to/ajax/v2/episode/sources?id=" +
                    elements[i].getAttribute("data-id"),
                name: elements[i].innerText + " (Dub)",
            });
        }
    }
    servers.push(
        {
            title: "Sub",
            list: subServersList
        },
        {
            title: "Dub",
            list: dubServersList
        },
    )

    sendResult(JSON.stringify(servers));
    getSource(servers[0].list[0].url);
}

function extractAndConcatenateString(originalString: string, stops: [number, number][]) {
    let decryptedKey = '';
    let offset = 0;
    let encryptedString = originalString

    for (const i in stops) {
        const start = stops[i][0];
        const end = stops[i][1];

        decryptedKey += encryptedString.slice(
            start - offset,
            end - offset
        )

        encryptedString = encryptedString.slice(0, start - offset) + encryptedString.slice(end - offset);
        offset += end - start;
    }

    return {
        dec_key: decryptedKey,
        enc_string: encryptedString
    }
}

function getFile(url: string) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    } else {
        return null;
    }
}

async function getSource(url: string) {

    const link = JSON.parse(await sendRequest(url, {})).link;
    const embedId = link
        .replace("https://megacloud.tv/embed-2/e-1/", "")
        .split("?")[0];

    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");

    const embedUrl = `https://megacloud.tv/embed-2/ajax/e-1/getSources?id=${embedId}`;

    const myJsonObject = JSON.parse(await sendRequest(embedUrl, {}));

    if (myJsonObject["encrypted"] == true) {
        let base64 = myJsonObject["sources"];
        let enc_key = getFile(
            "https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt"
        )!;
        let keyArray = [];

        try {
            keyArray = JSON.parse(enc_key);
        } catch (err) {

        }

        let key = extractAndConcatenateString(base64, keyArray);

        // @ts-ignore
        const decryptedSources = CryptoJS.AES.decrypt(key.enc_string, key.dec_key).toString(
            // @ts-ignore
            CryptoJS.enc.Utf8
        );

        const manifestUrl = JSON.parse(decryptedSources)[0].file;
        const resResult = getFile(manifestUrl)!;

        let qualities: Array<MediaQuality> = []
        const resolutions = resResult.split("\\n\\n")[0].match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);
        resolutions?.forEach((res) => {
            const index = manifestUrl.lastIndexOf('/');
            const quality = res.split('\n')[0].split('x')[1].split(',')[0];
            const url = manifestUrl.slice(0, index);
            qualities.push({
                file: url + '/' + res.split('\n')[1].replace("/", ""),
                type: "hls",
                quality: quality + 'p',
            });
        });

        qualities.push({ quality: "auto", file: manifestUrl, type: "hls" });

        const uniqueAuthors = qualities.reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.quality === current.quality)) {
                accumulator.push(current);
            }
            return accumulator;
        }, [] as MediaQuality[]);

        qualities = uniqueAuthors.map(item => item);

        sendResult(JSON.stringify({
            result: {
                skips:
                    myJsonObject["intro"] != null
                        ? [
                            {
                                start: myJsonObject["intro"]["start"],
                                end: myJsonObject["intro"]["end"],
                                type: "Opening",
                            },
                            {
                                start: myJsonObject["outro"]["start"],
                                end: myJsonObject["outro"]["end"],
                                type: "Ending",
                            },
                        ]
                        : [],
                sources: qualities,
                subtitles: myJsonObject["tracks"]
                    .map((element: any) => {
                        if (element["kind"] == "captions") {
                            return {
                                url: element["file"],
                                language: element["label"],
                            };
                        }
                    })
                    .filter((elements: any) => {
                        return (
                            elements != null &&
                            elements !== undefined &&
                            elements !== ""
                        );
                    }),
            },
            nextUrl: null,
        }), true);
    } else {
        const manifestUrl = myJsonObject["sources"][0].file;
        const resResult = getFile(manifestUrl)!;

        let qualities = []
        const resolutions = resResult.split("\\n\\n")[0].match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g);
        resolutions?.forEach((res) => {
            const index = manifestUrl.lastIndexOf('/');
            const quality = res.split('\n')[0].split('x')[1].split(',')[0];
            const url = manifestUrl.slice(0, index);
            qualities.push({
                file: url + '/' + res.split('\n')[1].replace("/", ""),
                type: "hls",
                quality: quality + 'p',
            });
        });

        qualities.push({ quality: "auto", file: manifestUrl, type: "hls" })

        const uniqueAuthors = qualities.reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.quality === current.quality)) {
                accumulator.push(current);
            }
            return accumulator;
        }, [] as MediaQuality[]);

        qualities = uniqueAuthors.map(item => item)
        
        sendResult(JSON.stringify({
            result: {
                skips:
                    myJsonObject["intro"] != null
                        ? [
                            {
                                start: myJsonObject["intro"]["start"],
                                end: myJsonObject["intro"]["end"],
                                type: "Opening",
                            },
                            {
                                start: myJsonObject["outro"]["start"],
                                end: myJsonObject["outro"]["end"],
                                type: "Ending",
                            },
                        ]
                        : [],
                sources: qualities,
                subtitles: myJsonObject["tracks"]
                    .map((element: any) => {
                        if (element["kind"] == "captions") {
                            return {
                                url: element["file"],
                                language: element["label"],
                            };
                        }
                    })
                    .filter((elements: any) => {
                        return (
                            !!elements
                        );
                    }),
            },
            nextUrl: null,
        }), true);
    }
}