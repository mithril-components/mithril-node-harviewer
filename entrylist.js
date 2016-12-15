// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* About rendering a list of entries.
*/

// Load required modules
const m           = require("mithril");

const entry       = require("./entry");



// Return an array using the controller of the entry mithril module.
const controller = (data, colors) => {
    // Sort entries from older started datetime to more recent.
    let orderEntries = !data.entries ? [] : data.entries.sort((a, b) => {
        const dateA = new Date(a.startedDateTime);
        const dateB = new Date(b.startedDateTime);

        if (dateA > dateB) {
            return 1;
        }
        else if (dateA < dateB) {
            return -1;
        }
        else {
            return 0;
        }
    });

    let pages = [{
        startedDateTime: (orderEntries[0] && orderEntries[0].startedDateTime ? orderEntries[0].startedDateTime : 0),
        id: (orderEntries[0] && orderEntries[0].pageref ? orderEntries[0].pageref : ""),
        title: (orderEntries[0] && orderEntries[0].request && orderEntries[0].request.url ? orderEntries[0].request.url : ""),
        pageTimings: {
            onLoad: (orderEntries[0] && orderEntries[0].startedDateTime ? Date.parse(orderEntries[orderEntries.length - 1].startedDateTime) - Date.parse(orderEntries[0].startedDateTime) : 0)
        }
    }];

    if (data && data.pages) {
        pages = data.pages;
    }

    return pages.map(page => {
        // Filter entries, keep the one related to the page.
        if (data && data.pages) {
            orderEntries = orderEntries.filter((entry) => {
                if (entry.pageref == page.id) {
                    return true;
                }
                return false;
            });
        }
        return entry.controller(page, orderEntries, colors);
    });
}

// Return a entries list by using the view of the entry mithril module.
const view = (ctrl) => {

    return m("ul.accordion", [
        ctrl.map(barCtrl => {
            return entry.view(barCtrl);
        })
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
