import { readFileSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { commonCode } from "./commonCode";
import colors from "colors";


function readFile(pathname: string) {
    return readFileSync(path.join(__dirname, pathname), "utf-8");
}

function throwError(message: string) {
    console.log(colors.red(message));
    process.exit(1);
}

async function ini(code: string, action: string, payload: string) {

    let result: any;

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            "--disable-web-security"
        ]
    });

    const page = await browser.newPage();

    page.on("console", message => {
        result = message.text();
        console.log(message.text());
    });

    await page.setJavaScriptEnabled(true);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.setContent(`<script>${commonCode}${code}</script>`);

    const data = {
        query: payload,
        action
    };

    await page.evaluate(async (param) => {
        if (param.action === "getEpList") {
            // @ts-ignore
            await getEpList(param);
        } else if (param.action === "getSource") {
            // @ts-ignore
            await getSource(param);
        } else {
            // @ts-ignore
            await logic(param);
        }
    }, data);

    await browser.close();

    return result;
}


const usageByAction = {
    "home": `    • ${colors.yellow("ts-node test/index.ts " + colors.grey("home"))}`,
    "search": `    • ${colors.yellow("ts-node test/index.ts " + colors.grey("search \"Odd taxi\""))}`,
    "info": `    • ${colors.yellow("ts-node test/index.ts " + colors.grey("info \"htts://www.example.com/info\""))}
    • ${colors.yellow("ts-node test/index.ts " + colors.grey("info \"htts://www.example.com/list\" getEpList"))}`,
    "watch": `    • ${colors.yellow("ts-node test/index.ts " + colors.grey("media \"htts://www.example.com/servers\""))}
    • ${colors.yellow("ts-node test/index.ts " + colors.grey("media \"htts://www.example.com/link\" getSource"))}`
} as { [key: string]: string };

const usage =
    `\nUsage: ${colors.yellow("ts-node test/index.ts " + colors.grey("<action> <payload> <entry function>"))}
\nExamples:\n${Object.values(usageByAction).join("\n\n")}`



const folderName = process.argv[2]?.toLowerCase()?.trim();

if (!folderName || folderName == "-h" || folderName === "--help") {
    throwError(usage);
}


const distFolder = {
    "info": {
        name: "Info",
        entryFunctions: ["logic", "getEpList"],
        requiresPayload: true
    },
    "media": {
        name: "Media",
        entryFunctions: ["logic", "getSource"],
        requiresPayload: true
    },
    "search": {
        name: "Search",
        entryFunctions: ["logic"],
        requiresPayload: true
    },
    "home": {
        name: "Home",
        entryFunctions: ["logic"],
        requiresPayload: false
    },
    "all": {
        name: "all",
        entryFunctions: [""],
        requiresPayload: false
    }
} as {
    [key: string]: {
        name: string,
        entryFunctions: string[],
        requiresPayload: boolean
    }
};

let code = "", payload = "", entryFunction = "logic";

if (folderName in distFolder) {
    const currentAction = distFolder[folderName];

    if (currentAction.name != "all") {
        code = readFile(`../dist/${currentAction.name}/code.js`);
    }

    if (currentAction.requiresPayload) {
        const tempPayload = process.argv[3];
        const isNotHelp = tempPayload != "-h" && tempPayload != "--help";
        if (tempPayload && isNotHelp) {
            payload = tempPayload;
        } else if (isNotHelp) {
            throwError(`${colors.yellow(currentAction.name)} requires a payload, but none was found.\n\nUsage:\n${usageByAction[currentAction.name.toLowerCase()]}`);
        } else {
            throwError(`Usage:\n${usageByAction[currentAction.name.toLowerCase()]}`);
        }

    }

    if (currentAction.entryFunctions.length > 1) {
        const entryPoint = process.argv[4]?.trim();

        if (entryPoint) {
            if (currentAction.entryFunctions.includes(entryPoint)) {
                entryFunction = entryPoint;
            } else {
                throwError(`Entry function ${colors.yellow(entryPoint)} not found. Try using either of these:\n${colors.yellow(currentAction.entryFunctions.map((elem) => `• ${elem}`).join("\n"))
                    }`)
            }
        } else {
            console.log(colors.yellow("Defaulting to logic entry point"));
        }
    }
} else {
    throwError(
        `Action not found. Try using either of these actions:\n${colors.yellow(
            Object.keys(distFolder).map((elem) => `• ${elem}`).join("\n")
        )
        }
        ${usage}
    `);
}

(async function () {
    if (folderName === "all") {
        // =====================
        //        Search
        // =====================
        const searchCode = readFile(`../dist/Search/code.js`);
        const searchResult = JSON.parse(await ini(searchCode, "logic", "odd"));

        if (searchResult.result?.length === 0) {
            console.log(colors.red("Search may not be working"));
        }

        // =====================
        //       Homepage
        // =====================

        const homeCode = readFile(`../dist/Home/code.js`);
        const homeResult = JSON.parse(await ini(homeCode, "logic", ""));


        // =====================
        //        Info
        // =====================

        const infoCode = readFile(`../dist/Info/code.js`);

        const infoMeta = JSON.parse(await ini(infoCode, "logic", homeResult.result[0].data[0].url));
        const infoList = JSON.parse(await ini(infoCode, "getEpList", infoMeta.result.epListURLs[0]));


        // =====================
        //       Media
        // =====================

        const mediaCode = readFile(`../dist/Media/code.js`);

        const mediaServer = JSON.parse(await ini(mediaCode, "logic", infoList.result[0].list[0].url));
        const mediaLink = JSON.parse(await ini(mediaCode, "getSource", mediaServer.result[0].list[0].url));


        console.log(colors.yellow("Everything seems to be working fine!"));
    } else {
        await ini(code, entryFunction, payload);
    }
})();
