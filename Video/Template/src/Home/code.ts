async function logic(payload: BasePayload) {
    const result = [
        {
            type: "Carousel",
            title: "Spotlight",
            data: Array(10).fill({
                url: "<url>",
                titles: {
                    primary: "Lorem Ipsum",
                },
                image: `https://picsum.photos/1000`,
                subtitle: "subtitle",
                subtitleValue: [],
                buttonText: "Button text",
                iconText: "Icon text",
                showIcon: false,
                indicator: "Indicator",
                current: 10,
                total: 100,
            }),
        },
        {
            type: "grid_2x",
            title: "Recently Released",
            data: Array(10).fill({
                url: "<url>",
                titles: {
                    primary: "Lorem Ipsum",
                },
                image: "https://picsum.photos/1000",
                subtitle: "",
                subtitleValue: [],
                buttonText: "Placeholder",
                iconText: "",
                showIcon: false,
                indicator: "Indicator",
                current: 10,
                total: 100,
            }),
        },
    ] as HomepageFinalData[];

    sendResult(
        {
            action: "homepage",
            result,
        },
        true
    );
}

export {};
