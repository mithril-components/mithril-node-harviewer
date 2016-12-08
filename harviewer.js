// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* About rendering data summary about har (graphs, etc...).
*/

// Load required modules
const m         = require("mithril");

const entrylist = require("./entrylist");
const chartlist = require("./chartlist");



// Return JSON containing all data to display har data.
const controller = (harFile) => {
    // Checking if the root object "log" is present (required object).
    const har = (harFile && harFile.log ? harFile.log : {});

    // Define a unique colors used for bar and pie chart rendering.
    const colors = {
        blocked:      "#1ab0c2",
        dns:          "#9af288",
        ssl:          "#ae0638",
        connect:      "#41edb5",
        send:         "#a00ad5",
        wait:         "#d1e537",
        receive:      "#76a5fa",
        html:         "#55ca40",
        javascript:   "#af3e4e",
        css:          "#7934f6",
        image:        "#c1969a",
        flash:        "#f1a489",
        others:       "#EEB954",
        headSent:     "#81a72d",
        headReceived: "#1e6b85",
        bodySent:     "#fac813",
        bodyReceived: "#f8944b",
        downloaded:   "#973028",
        partial:      "#8f4680",
        cache:        "#0f825b"
    };

    return {
        chartlistCtrl: chartlist.controller(har, colors),
        entrylistCtrl: entrylist.controller(har, colors)
    }
}

// Return view to render har data.
const view = (ctrl) => {
    return m("div", [
        m("div.harviewer", [
            chartlist.view(ctrl.chartlistCtrl),
            entrylist.view(ctrl.entrylistCtrl)
        ])
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
