#!/usr/bin/env node
'use strict'

// Load required modules
const m                 = require('mithril');
const Localize          = require('localize');

const bar               = require('./bar');


// Load translation file
const t = new Localize('./translations');
t.throwOnMissingTranslation(false);
t.setLocale(process.env.LANG);



// Return a string with the byte precision.
const sizePrecision = (size) => {
    if (size > 10000) {
        return (size / 1000).toPrecision(3) + 'KB';
    }
    else if (size > 1000) {
        return (size / 1000).toPrecision(2) + 'KB';
    }
    else {
        return size + 'B';
    }
}

// Render request time bar.
const renderBar = (page, firstEntry, entry, colors) => {
    
    const redefinedPage = {
        onLoad:             page.pageTimings.onLoad - (Date.parse(firstEntry.startedDateTime) - Date.parse(page.startedDateTime)),
        onContentLoad:      page.pageTimings.onContentLoad - firstEntry.time,
        startedDateTime:    firstEntry.startedDateTime
  };

    const ctrl = bar.controller(redefinedPage, entry, colors);
    return bar.view(ctrl);
}

// Return a JSON containing the page and his entries.
const controller = (page, entries, colors) => {
    return {
        firstEntry:     entries[0],
        page:           page,
        entries:        entries,
        colors:         colors
    };
}

// Display all entries for a page.
const view = (ctrl) => {
    let totalSize = 0;

    return m('li', { id: ctrl.page.id }, [
        m('h4', ctrl.page.title),
        m('div', t.translate('Requests start ') + (Date.parse(ctrl.firstEntry.startedDateTime) - Date.parse(ctrl.page.startedDateTime)) + t.translate('ms before the first request.')),
        m('div', ''),
        m('ul.accordion-content', [
            ctrl.entries.map((entry, index) => {

                totalSize += entry.response.bodySize;

                return m('li', { id: index }, [
                    m('input', { type: 'checkbox' }),
                    m('div.row.', [
                        m('div.col-md-2.col-xs-12.col-print-12.url', [
                            entry.request.method + ' ',
                            m('a', { href: entry.request.url }, entry.request.url)
                        ]),
                        m('div.col-md-1.col-xs-12.col-print-12', entry.response.status + ' ' + entry.response.statusText),
                        m('div.col-md-1.col-xs-12.col-print-12', sizePrecision(entry.response.bodySize)),
                        m('div.col-md-8.col-xs-12.col-print-12', renderBar(ctrl.page, ctrl.firstEntry, entry, ctrl.colors))
                    ])
                ]);
            }),
            m('li.row', [
                m('div.col-xs-3', ctrl.entries.length + t.translate(' Requests')),
                m('div.col-xs-4', sizePrecision(totalSize)),
                m('div.col-xs-5', t.translate('onload: ') + ctrl.page.pageTimings.onLoad + 'ms'),
            ])
        ])
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
