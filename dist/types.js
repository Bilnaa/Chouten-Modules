"use strict";
let reqId = 0;
let resolveFunctions = {};
window.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    if (data.action === "logic") {
        try {
            await logic(data.payload);
        }
        catch (err) {
            sendSignal(1, err.toString());
        }
    }
    else {
        resolveFunctions[data.reqId](data.responseText);
    }
};
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
function sendRequest(url, headers) {
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
function sendResult(result, last = false) {
    const currentReqId = (++reqId).toString();
    // @ts-ignore
    Native.sendHTTPRequest(JSON.stringify({
        reqId: currentReqId,
        action: "result",
        shouldExit: last,
        result: JSON.stringify(result)
    }));
}
function sendSignal(signal, message = "") {
    const currentReqId = (++reqId).toString();
    // @ts-ignore
    Native.sendHTTPRequest(JSON.stringify({
        reqId: currentReqId,
        action: signal === 0 ? "exit" : "error",
        result: message
    }));
}
