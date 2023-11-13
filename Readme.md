# Note

This repository is a platform for user-generated content, and I do not host or control the specific files shared here. If you believe there is a copyright infringement, please direct your notice to the actual host or provider of the content. Thank you for your understanding.

# Structure of the module
```
├── Home
│   └── code.js
├── Info
│   └── code.js
├── Media
│   └── code.js
├── Search
│   └── code.js
├── metadata.json
└── icon.png
```

# Structure of metadata.json

```
{
    "id": String (Should be a UUID) (e.g. "078efc22-3314-11ee-be56-0242ac120002"),
    "type": "Video" or "Book" or "Text" (e.g. "Video"),
    "subtypes": String Array (e.g. ["anime"]),
    "name": String (e.g. "Aniwatch.to"),
    "version": String (e.g. "0.3.0"),
    "formatVersion": Number (e.g. 1),
    "updateUrl": String (e.g. "https://raw.githubusercontent.com/adolar0042/MyModule/main/module.json"),
    "general": {
      "author": String (e.g. "Inumaki"),
      "description": String (e.g. "A module to get the data from aniwatch.to"),
      "lang": String Array (e.g. ["en-US"]),
      "baseURL": String (e.g. "https://mymodule.com"),
      "bgColor":  String (e.g. "#ffcb3d"),
      "fgColor": String (e.g. "#000000")
    }
}
```

# Structure of code.js

You can put any functions in code.js, but there are some functions that the js file already has access to:

1. A function named `logic`: The logic function is an `async` function, that will receive a parameter which will be a JSON Object. Refer to the demo code to see when this is relevant. (todo)
   * **Signature**: `logic(params: { [key: string]: string }): Promise<void>`
   * **Note**: This function will be automatically called by the app, so make sure not to invoke it any where.

2. To send HTTP requests with headers call the `sendRequest` function with the parameters `url` and `headers`:
   * **Signature**: `sendRequest(url: string, headers: { [key: string]: string }): Promise<string>`
   * **Example**: If you wanted to send a request to **ht<span>tps://www</span>.example.com** with the header **{referer: "ht<span>tps://www</span>.example.com"}**, you'd run:
     * ```await sendRequest("https://www.example.com", {referer: "https://www.example.com"})```

3. To load a js in a <script> tag, `loadScript` can be used. This will load the script to the DOM.
   * **Signature**: `loadScript(url: string): Promise<void>`
   * **Example**: if you wanted to load CryptoJS, you'd run:
     * ```await loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");```

4. To send the result back to the app, `sendResult` should be used. It may be called multiple times from the same js file (see: Info/code.js)
   * **Signature**: `sendResult(result: string, last: boolean = false): Promise<void>`;
   * **Example**: Run **sendResult(JSON.stringify(result))** to send the result.
   * **Note**: The type of `result` varies. Refer to the demo code to see what type it should be of.
   * **Note** The `last` argument is used to tell that it's safe for the app to close the webview.
     
# Building Modules
To build modules, simply run `make build-module` in the respective folder. If you don't have `jq` installed, you can run `brew install jq` or `choco install jq` on MacOS.