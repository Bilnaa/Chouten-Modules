async function logic(payload: BasePayload) {

    // const html = await fetch(`https://aniwatch.to/search?keyword=${encodeURIComponent(payload.query)}`, {});
    const searchJSON = JSON.parse(await sendRequest(
        "https://search.htv-services.com/",
        {
            "Content-Type": "application/json",
        },
        "POST",
        JSON.stringify({
            "search_text": payload.query,
            "tags":[],
            "tags_mode":"AND",
            "brands":[],
            "blacklist":[],
            "order_by":"created_at_unix",
            "ordering":"desc",
            "page":0
        })
    ));


    const titles: SearchData = [];
    // console.log(searchJSON);
    for(const i of JSON.parse(searchJSON['hits'])){
        //Fuck it i'm going in raw
       titles.push({img: i['cover_url'], title: i['name'], url: `https://hanime.tv/videos/hentai/${i['slug']}`, indicatorText: 'Sub', currentCount: NaN, totalCount: NaN});
    }

    sendResult({
        action: "search",
        result: titles
    });
}