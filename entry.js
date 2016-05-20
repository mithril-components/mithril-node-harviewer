#!/usr/bin/env node
'use strict'

// Load required modules
const m                 = require('mithril');

const bar               = require('./bar');



// Return a string with the byte precision.
const sizePrecision = (size) => {
    size = size < 0 ? 0 : size;

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

// Return a string with the time precision.
const timePrecision = (time) => {
    time = time < 0 ? 0 : time;

    if (time > 1000) {
        return (time / 1000).toPrecision(3) + ' s';
    }
    else {
        return time + ' ms';
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
    let totalSize = 0;
    let biggestTime = 0;

    entries.forEach((entry, index) => {
        totalSize += entry.response.bodySize;
        biggestTime = (entry.time > biggestTime ? entry.time : biggestTime);
    })

    return {
        firstEntry:     entries[0],
        totalSize:      totalSize,
        biggestTime:    biggestTime,
        page:           page,
        entries:        entries,
        colors:         colors
    };
}

// Display all entries for a page.
const view = (ctrl) => {
    const TTFB = ctrl.firstEntry.timings.blocked + ctrl.firstEntry.timings.dns + ctrl.firstEntry.timings.connect + ctrl.firstEntry.timings.send + ctrl.firstEntry.timings.wait + ctrl.firstEntry.timings.ssl;
    return m('li', { id: ctrl.page.id }, [
        m('div.data-summary', [
            m('h2', ctrl.page.title),
            m('div.row', [
                m('div.col-md-3.col-xs-6', `Total load time : `),
                m('div.col-md-9.col-xs-6', timePrecision(ctrl.page.pageTimings.onLoad))
            ]),
            m('div.row', [
                m('div.col-md-3.col-xs-6', `Time to first byte : `),
                m('div.col-md-9.col-xs-6', timePrecision(TTFB))
            ]),
            m('div.row', [
                m('div.col-md-3.col-xs-6', `Total load : `),
                m('div.col-md-9.col-xs-6', sizePrecision(ctrl.totalSize))
            ]),
            m('div.row', [
                m('div.col-md-3.col-xs-6', `Most biggest time consuming : `),
                m('div.col-md-9.col-xs-6', timePrecision(ctrl.biggestTime))
            ]),
            m('div.row', [
                m('div.col-md-3.col-xs-6', `Total requests : `),
                m('div.col-md-9.col-xs-6', ctrl.entries.length + ` requests`)
            ])
        ]),
        m('ul.accordion-content', [
            ctrl.entries.map((entry, index) => {
                const status = entry.response.status.toString();

                return m('li', { id: index }, [
                    m('input', { type: 'checkbox' }),
                    m('div.row', [
                        m('div.col-md-2.col-xs-12.col-print-12.url', [
                            entry.request.method + ' ',
                            m('a', { href: entry.request.url }, entry.request.url)
                        ]),
                        m('div.col-md-1.col-xs-12.col-print-12', status.charAt(0) === '4' || status.charAt(0) === '5' ? { class: 'text-danger' } : {}, status + ' ' + entry.response.statusText),
                        m('div.col-md-1.col-xs-12.col-print-12', sizePrecision(entry.response.bodySize)),
                        m('div.col-md-8.col-xs-12.col-print-12', renderBar(ctrl.page, ctrl.firstEntry, entry, ctrl.colors))
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