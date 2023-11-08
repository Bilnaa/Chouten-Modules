"use strict";
async function logic(payload) {
    const trending = JSON.parse(await sendRequest("https://hanime.tv/api/v8/browse-trending?time=day", {
        "Content-Type": "application/json",
        "X-Signature-Version": "web2",
    }));
    let spotlight_data = [];
    for (const i of trending['hentai_videos']) {
        //Fuck it i'm going in raw
        spotlight_data.push({
            image: i['cover_url'],
            titles: { primary: i['name'] },
            url: `https://hanime.tv/videos/hentai/${i['slug']}`,
            current: 1,
            total: 1,
            showIcon: false,
            indicator: "",
            buttonText: "",
            subtitle: "",
            subtitleValue: []
        });
    }
    const recents = JSON.parse(await sendRequest("https://search.htv-services.com/", {
        "Content-Type": "application/json",
    }, "POST", JSON.stringify({
        "search_text": "",
        "tags": [],
        "tags_mode": "AND",
        "brands": [],
        "blacklist": [],
        "order_by": "released_at_unix",
        "ordering": "desc",
        "page": 0
    })));
    let recents_data = [];
    for (const i of JSON.parse(recents['hits'])) {
        //Fuck it i'm going in raw
        recents_data.push({
            image: i['cover_url'],
            titles: { primary: i['name'] },
            url: `https://hanime.tv/videos/hentai/${i['slug']}`,
            current: 1,
            total: 1,
            showIcon: false,
            indicator: "Recents",
            buttonText: "",
            subtitle: "",
            subtitleValue: []
        });
    }
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: spotlight_data
        },
        {
            type: "grid_2x",
            title: "Recently Released",
            data: recents_data
        },
        // {
        //     type: "grid_3x",
        //     title: "Most Viewed",
        //     data: []
        // },
    ];
    sendResult({
        action: "homepage",
        result
    }, true);
}
