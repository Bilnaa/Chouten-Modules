"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logic(payload) {
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
    ];
    sendResult({
        action: "homepage",
        result,
    }, true);
}
