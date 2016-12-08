// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* About rendering a list of specific charts.
*/


// Load required modules
const m                 = require("mithril");
const chart             = require("mithril-node-piechart");

const utilities         = require("./utilities");



// Compute and return JSON containing data to render pie charts about har content.
const controller = (har, colors) => {
    // Define variables to store and compute data for the chartpie.
    let downloaded = 0, partial = 0, cache = 0;
    let data = {
        timings: [
            { title: `Blocked`, name: "blocked",    value: 0, color: colors.blocked },
            { title: `DNS`,     name: "dns",        value: 0, color: colors.dns },
            { title: `SSL/TLS`, name: "ssl",        value: 0, color: colors.ssl },
            { title: `Connect`, name: "connect",    value: 0, color: colors.connect },
            { title: `Send`,    name: "send",       value: 0, color: colors.send },
            { title: `Wait`,    name: "wait",       value: 0, color: colors.wait },
            { title: `Receive`, name: "receive",    value: 0, color: colors.receive }
        ],
        mimeTypes: [
            { title: `HTML/Text`,   name: "html",       value: 0, color: colors.html },
            { title: `JavaScript`,  name: "javascript", value: 0, color: colors.javascript },
            { title: `CSS`,         name: "css",        value: 0, color: colors.css },
            { title: `Image`,       name: "image",      value: 0, color: colors.image },
            { title: `Flash`,       name: "flash",      value: 0, color: colors.flash },
            { title: `Others`,      name: "others",     value: 0, color: colors.others }
        ],
        request: [
            { title: `Headers Sent`,    name: "headersSize",  value: 0, color: colors.headSent },
            { title: `Bodies Sent`,     name: "bodySize",     value: 0,  color: colors.bodySent }
        ],
        response : [
            { title: `Headers Received`,    name: "headersSize",  value: 0, color: colors.headReceived },
            { title: `Bodies Received`,     name: "bodySize",     value: 0, color: colors.bodyReceived }
        ]
    };

    // Check if the entries array is present (object required).
    if (har && har.entries) {
        for (let i = 0, len = har.entries.length; len > i; ++i) {     
            // Compute data to display the action type piechart.
            if (har.entries[i].timings) {
                data.timings.forEach(item => {
                    item.value += (har.entries[i].timings[item.name] && har.entries[i].timings[item.name] > 0 ? har.entries[i].timings[item.name] : 0);
                });
            }

            if (har.entries[i].response) {
                // Compute data to display the languages and technologies used.
                if (har.entries[i].response.content && har.entries[i].response.content.mimeType) {
                    data.mimeTypes.forEach(item => {
                        if (har.entries[i].response.content.mimeType.search(item.name) != -1) {
                            item.value += (har.entries[i].response.bodySize && har.entries[i].response.bodySize > 0 ? har.entries[i].response.bodySize : (har.entries[i].response.content.size ? har.entries[i].response.content.size : 0));
                        }
                    });
                }
                // Compute data to display the headers and bodies.
                data.response.forEach(item => {
                    item.value += (har.entries[i].response[item.name] && har.entries[i].response[item.name] > 0 ? har.entries[i].response[item.name] : 0);
                });

                // ?? : partial += data.entries[i].response.bodySize;
                if (har.entries[i].response.bodySize) {
                    if (har.entries[i].cache && har.entries[i].cache.afterRequest) {
                        cache += har.entries[i].response.bodySize;
                    }
                    else {
                        downloaded += har.entries[i].response.bodySize;
                    }
                }
            }

            if (har.entries[i].request) {
                data.request.forEach(item => {
                    item.value += (har.entries[i].request[item.name] && har.entries[i].response[item.name] > 0 ? har.entries[i].request[item.name] : 0);
                });
            }
        }
    }

    data.mimeTypes.forEach(item => {
        item.value = (item.value > 0 ? item.value : 0) / 100;
    });

    return [
        chart.controller({
            width:  100,
            height: 100,
            title: "Summary of request times",
            parts: data.timings
        }),
        chart.controller({
            width:  100,
            height: 100,
            title: "Summary of content types",
            parts: data.mimeTypes
        }),
        chart.controller({
            width:  100,
            height: 100,
            title: "Sent and received bodies & headers",
            parts: data.request.concat(data.response)
        }),
        chart.controller({
            width:  100,
            height: 100,
            title: "Comparison of data from server and cache",
            parts:
            [
                { title: `Downloaded`,   value: (downloaded > 0 ? downloaded : 0),    color: colors.downloaded },
                { title: `Partial`,      value: (partial > 0 ? partial : 0),          color: colors.partial },
                { title: `From Cache`,   value: (cache > 0 ? cache : 0),              color: colors.cache }
          ]
        })
    ];
}

// Return view to render every pie charts.
const view = (ctrl) => {
    return m("div.row", [
        ctrl.map((chartCtrl, index) => {
            return m("div.col-lg-3.col-md-6.col-xs-12.piecharts", [
                m("h6.row", chartCtrl.title),
                // Render pie charts.
                m("div.row", chart.view(chartCtrl)),
                    // Render a table to display details about pie chart data.
                chartCtrl.parts.map(part => {
                    return m("div.row.piechart-table", [
                            m("div.col-xs-6", part.title),
                            (part.title === "Wait" || part.title === "Receive" ? "" : m("div.col-xs-6", (index > 0 ? utilities.sizePrecision(part.value) : utilities.timePrecision(part.value))))
                        ]);
                })
            ]);
        })
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}

