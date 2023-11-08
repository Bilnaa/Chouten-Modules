let reqId = 0;
let resolveFunctions: { [key: string]: Function } = {};

window.onmessage = async function (event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.action === "logic") {
        try {
            await logic(data.payload);
        } catch (err: any) {
            sendSignal(1, err.toString());
        }
    } else {
        resolveFunctions[data.reqId](data.responseText);
    }
}

function loadScript(url: string){
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

function sendRequest(url: string, headers: { [key: string]: string }): Promise<string> {
    return new Promise((resolve, reject) => {
        const currentReqId = (++reqId).toString();

        resolveFunctions[currentReqId] = resolve;

        // @ts-ignore
        Native.sendHTTPRequest(JSON.stringify({
            reqId: currentReqId,
            action: "HTTPRequest",
            url,
            headers
        }));
    });
}

function sendResult(result: string, last = false) {
    const currentReqId = (++reqId).toString();

    // @ts-ignore
    Native.sendHTTPRequest(JSON.stringify({
        reqId: currentReqId,
        action: "result",
        shouldExit: last,
        result
    }));
}

function sendSignal(signal: number, message: string = "") {
    const currentReqId = (++reqId).toString();

    // @ts-ignore
    Native.sendHTTPRequest(JSON.stringify({
        reqId: currentReqId,
        action: signal === 0 ? "exit" : "error",
        result: message
    }));
}

// =====================
//      Homepage
// =====================

type HompageData = {
    url: string;
    titles: {
        primary: any;
        secondary?: string | null;
    };
    image: string | null;
    subtitle: any;
    subtitleValue: never[];
    buttonText: string;
    iconText?: string;
    showIcon: boolean;
    indicator: string;
    current?: number | null;
    total?: number | null;
};

type HomepageFinalData = {
    result: {
        type: "Carousel" | "list" | "grid_<number>x" | string,
        title: string,
        data: HompageData[]
    }[],
    nextUrl: null | string;
}

interface RequestObject {
    url: string,
    method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH",
    headers: { [key: string]: any }[],
    body: string | null
}

interface RequestData {
    request: RequestObject | null,
    removeScripts?: boolean,
    allowExternalScripts?: boolean,
    usesApi?: boolean,
}

// =====================
//        Info
// =====================

interface InfoData {
    result: {
        id: string;
        titles: {
            primary: string;
            secondary: string | undefined;
        };
        altTitles: string[];
        description: string | undefined;
        poster: string | null | undefined;
        status: string | undefined;
        totalMediaCount: number;
        mediaType: string;
        seasons: {
            name: string;
            url: string;
        }[];
        mediaList: any[];
    }
}

interface InfoEpisodeList {
    list: {
        url: string;
        title: string;
        number: number;
    }[],
    title: string,
}

// =====================
//         Media
// =====================

interface MediaDataResult {
    title: string;
    list: {
        url: string;
        name: string;
    }[];
}

interface MediaData {
    result: MediaDataResult[],
    nextUrl: string | null
}

interface MediaQuality {
    quality: string,
    file: string,
    type: string
}

interface MediaVideo {
    result: {
        skips: {
            start: number;
            end: number;
            type: string;
        }[];
        sources: MediaQuality[];
        subtitles: {
            url: string,
            language: string,
        }[]
    }
}

// =====================
//         Search
// =====================

type SearchData = {
    url: string;
    img: string;
    title: string;
    indicatorText: string;
    currentCount: number;
    totalCount: number;
}[];