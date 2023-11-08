type NonEmptyArray<T> = [T, ...T[]];
const CryptoJS: any = {};
interface BasePayload {
    query: string,
    action: string
}

type BaseResult = {
    action: "search"
    result: SearchData
} | {
    action: "homepage"
    result: HomepageFinalData[]
} | {
    action: "metadata"
    result: InfoData
} | {
    action: "eplist"
    result: InfoEpisodeList[]
} | {
    action: "server"
    result: MediaDataResult[]
} | {
    action: "video"
    result: MediaVideo
};

let reqId = 0;
let resolveFunctions: { [key: string]: Function } = {};

// window.onmessage = async function (event: MessageEvent) {
//     const data = JSON.parse(event.data);

//     if (data.action === "logic") {
//         try {
//             await logic(data.payload);
//         } catch (err: any) {
//             sendSignal(1, err.toString());
//         }
//     } else {
//         resolveFunctions[data.reqId](data.responseText);
//     }
// }

function loadScript(url: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

function sendRequest(url: string, headers: { [key: string]: string }, method?: string, body?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const currentReqId = (++reqId).toString();

        resolveFunctions[currentReqId] = resolve;

        // @ts-ignore
        Native.sendHTTPRequest(JSON.stringify({
            reqId: currentReqId,
            action: "HTTPRequest",
            url,
            headers,
            method: method,
            body: body
        }));
    });
}

function sendResult(result: BaseResult, last = false) {
    const currentReqId = (++reqId).toString();

    // @ts-ignore
    Native.sendHTTPRequest(JSON.stringify({
        reqId: currentReqId,
        action: "result",
        shouldExit: last,
        result: JSON.stringify(result)
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
    type: "Carousel" | "list" | "grid_<number>x" | string,
    title: string,
    data: HompageData[]
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
    id: string;
    titles: {
        primary: string;
        secondary: string | undefined;
    };
    altTitles: string[];
    epListURLs: NonEmptyArray<string>;
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

interface InfoEpisodeList {
    list: {
        url: string;
        title: string;
        number: number;
    }[],
    title: string
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
    skips: {
        start: number;
        end: number;
        type: string;
    }[];
    headers: {[key: string]: string},
    sources: MediaQuality[];
    subtitles: {
        url: string,
        language: string,
    }[]
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