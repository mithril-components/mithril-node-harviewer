#!/usr/bin/env node
'use strict'

// Load required modules
const m           = require('mithril');

const entry       = require('./entry');



// Return an array using the controller of the entry mithril module.
const controller = (data, colors) => {
    return data.pages.map(page => {

        // Filter entries, keep the one related to the page.
        const filterEntries = data.entries.filter((entry) => {
            if (entry.pageref == page.id) {
                return true;
            }
            return false;
        });

        // Sort entries from older started datetime to more recent.
        const orderEntries = filterEntries.sort((a, b) => {
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

        return entry.controller(page, orderEntries, colors);
  });
}

// Return a entries list by using the view of the entry mithril module.
const view = (ctrl) => {
    return m('ul.accordion', [
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
