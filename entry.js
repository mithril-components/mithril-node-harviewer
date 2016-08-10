// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* About rendering a har page entry.
*/

// Load required modules
const m                 = require("mithril");

const bar               = require("./bar");
const utilities         = require("./utilities");



// Render request time bar.
const renderBar = (page, firstEntry, entry, colors) => {
    
    const redefinedPage = {
        onLoad:             (page && page.pageTimings && page.pageTimings.onLoad && page.startedDateTime && firstEntry && firstEntry.startedDateTime ? (page.pageTimings.onLoad - (Date.parse(firstEntry.startedDateTime) - Date.parse(page.startedDateTime))) : 0),
        onContentLoad:      (page && page.pageTimings && page.pageTimings.onContentLoad && firstEntry && firstEntry.time ? (page.pageTimings.onContentLoad - firstEntry.time) : 0),
        startedDateTime:    (firstEntry &&  firstEntry.startedDateTime ? firstEntry.startedDateTime : 0)
    };

    const ctrl = bar.controller(redefinedPage, entry, colors);
    return bar.view(ctrl);
}

// Return a JSON containing the page and his entries.
const controller = (page, entries, colors) => {
    let totalSize = 0;
    let biggestTime = 0;

    if (entries) {
        entries.forEach((entry, index) => {
            totalSize += (entry.response && entry.response.bodySize ? entry.response.bodySize : 0);
            biggestTime = (entry.time > biggestTime ? entry.time : biggestTime);
        });
    }

    return {
        firstEntry:     (entries[0] ? entries[0] : {}),
        totalSize:      totalSize,
        biggestTime:    biggestTime,
        page:           (page ? page : {}),
        entries:        (entries ? entries : []),
        colors:         colors
    };
}

// Display all entries for a page.
const view = (ctrl) => {
    const TTFB = (ctrl.firstEntry.timings ? ctrl.firstEntry.timings.blocked + ctrl.firstEntry.timings.dns + ctrl.firstEntry.timings.connect + ctrl.firstEntry.timings.send + ctrl.firstEntry.timings.wait + ctrl.firstEntry.timings.ssl : 0);

    return m("li", { id: ctrl.page.id }, [
        m("div.data-summary", [
            m("h2", ctrl.page.title),
            m("div.row", [
                m("div.col-md-3.col-xs-6", `Total load time : `),
                m("div.col-md-9.col-xs-6", (ctrl.page.pageTimings && ctrl.page.pageTimings.onLoad ? utilities.timePrecision(ctrl.page.pageTimings.onLoad) : utilities.timePrecision(null)))
            ]),
            m("div.row", [
                m("div.col-md-3.col-xs-6", `Time to first byte : `),
                m("div.col-md-9.col-xs-6", utilities.timePrecision(TTFB))
            ]),
            m("div.row", [
                m("div.col-md-3.col-xs-6", `Total load : `),
                m("div.col-md-9.col-xs-6", utilities.sizePrecision(ctrl.totalSize))
            ]),
            m("div.row", [
                m("div.col-md-3.col-xs-6", `Most time consuming : `),
                m("div.col-md-9.col-xs-6", utilities.timePrecision(ctrl.biggestTime))
            ]),
            m("div.row", [
                m("div.col-md-3.col-xs-6", `Total requests : `),
                m("div.col-md-9.col-xs-6", ctrl.entries.length + ` requests`)
            ])
        ]),
        m("ul.accordion-content", [
            ctrl.entries.map((entry, index) => {
                const status = (entry.response && entry.response.status ? entry.response.status.toString() : "");

                return m("li", { id: index }, [
                    m("input", { type: "checkbox" }),
                    m("div.row", [
                        m("div.col-md-2.col-xs-12.col-print-12.url", [
                            (entry.request && entry.request.method ? entry.request.method : "") + " ",
                            m("a", { href: (entry.request && entry.request.url ? entry.request.url : "")  }, (entry && entry.request && entry.request.url ? entry.request.url : ""))
                        ]),
                        m("div.col-md-1.col-xs-12.col-print-12", status.charAt(0) === "4" || status.charAt(0) === "5" ? { class: "text-danger" } : {}, status + " " + (entry.response && entry.response.statusText ? entry.response.statusText : "Timeout")),
                        m("div.col-md-1.col-xs-12.col-print-12", utilities.sizePrecision(entry.response && entry.response.bodySize ? entry.response.bodySize : null)),
                        m("div.col-md-8.col-xs-12.col-print-12", renderBar(ctrl.page, ctrl.firstEntry, entry, ctrl.colors))
                    ])
                ]);
            })
        ])
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
