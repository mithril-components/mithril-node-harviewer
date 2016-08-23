// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* About rendering a timings har data bar.
*/

// Load required modules
const m           = require("mithril");



// Return JSON containing data to render timings har data bar.
const controller = (page, entry, colors) => {
    return ({
        width:              90,
        height:             20,
        onLoad:             (page && page.onLoad ? page.onLoad : 0),
        onContentLoad:      (page && page.onContentLoad ? page.onContentLoad : 0),
        startedDateTime:    (entry && entry.startedDateTime && page && page.startedDateTime ? Date.parse(entry.startedDateTime) - Date.parse(page.startedDateTime) : 0),
        value:              (entry && entry.time ? entry.time : 0),
        parts: [
            {
                // DNS
                value: (entry && entry.timings && entry.timings.dns ? entry.timings.dns : 0),
                color: colors.dns
            },
            {
                // CONNECT
                value: (entry && entry.timings && entry.timings.connect ? entry.timings.connect : 0),
                color: colors.connect
            },
            {
                // SEND
                value: (entry && entry.timings && entry.timings.send ? entry.timings.send : 0),
                color: colors.send
            },
            {
                // WAIT
                value: (entry && entry.timings && entry.timings.wait ? entry.timings.wait : 0),
                color: colors.wait
            },
            {
                // RECEIVE
                value: (entry && entry.timings && entry.timings.receive ? entry.timings.receive : 0),
                color: colors.receive
            }
        ],
    })
}

// Return a view to render a SVG of a timings har data bar.
const view = (ctrl) => {
    // 
    let startedDateTime = ctrl.startedDateTime;
    return m("svg", {
        width:          "100%",
        height:         ctrl.height,
        xmlns:          "http://www.w3.org/2000/svg",
        "xmlns:xlink":  "http://www.w3.org/1999/xlink"
    }, [
        m("rect", {
            x:              0,
            y:              0,
            width:          "100%",
            height:         ctrl.height,
            "stroke-width": 1,
            stroke:         "#000",
            opacity:        0.3,
            fill:           "none"
        }),
        // Draw every request phase time.
        ctrl.parts.map((map) => {
            const start = startedDateTime;
            startedDateTime += (map.value < 0 ? 0 : map.value);
            return m("rect", {
                x:         (ctrl.width * start) / ctrl.onLoad + "%",
                y:         0,
                width:     (ctrl.width * map.value) / ctrl.onLoad + "%",
                height:    ctrl.height,
                fill:      map.color
            });
        }),
        // Display the request time.
        m("text", {
            x:      (ctrl.width * startedDateTime) / ctrl.onLoad + 1 + "%",
            y:      ctrl.height * 3 / 4
        }, (ctrl.value > 1000 ? ((ctrl.value / 1000).toPrecision(2) + " s") : (ctrl.value.toPrecision(3) + " ms"))),
        // Draw the stroke showing when the page is loaded.
        m("line", {
            x1:             ctrl.width + "%",
            y1:             0,
            x2:             ctrl.width + "%",
            y1:             20,
            "stroke-width": 0.3,
            stroke:         "red"
        }),
        // Draw the stroke showing when the DOM is loaded.
        m("line", {
            x1:             (ctrl.width * ctrl.onContentLoad) / ctrl.onLoad + "%",
            y1:             0,
            x2:             (ctrl.width  * ctrl.onContentLoad) / ctrl.onLoad + "%",
            y1:             20,
            "stroke-width": 0.3,
            stroke:         "blue"
        })
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
