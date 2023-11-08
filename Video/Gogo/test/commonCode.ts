export const commonCode = `
        let reqId = 0;
        let resolveFunctions = {};

        async function sendRequest(url, headers, method, body) {
            return await (await fetch(url, {
                headers: headers,
                method: method ? method : "GET",
                body: body ? body : undefined
            })).text();
        }

        function sendResult(result, last = false) {
            window.currentResult = result;
            console.log(JSON.stringify(result, null, 4));
        }

        function sendSignal(signal, message = ""){
            console.log("Received signal " + signal + " : " + message);
        }

        function loadScript(url){
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
        
                document.head.appendChild(script);
            });
        }

`;