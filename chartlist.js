#!/usr/bin/env node
'use strict'

// Load required modules
const m                 = require('mithril');
const chart             = require('mithril-node-piechart');



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

// Return a string with the time precision.
const timePrecision = (time) => {
    if (time > 1000) {
        return (time / 1000).toPrecision(3) + ' s';
    }
    else {
        return time + ' ms';
    }
}

const controller = (data, colors) => {
    // Define variables to store and compute data for the chartpie.
    let blocked = 0, dns = 0, connect = 0, send = 0, wait = 0, receive = 0,
        html = 0, javascript = 0, css = 0, image = 0, flash = 0, others = 0,
        headSent = 0, bodySent = 0, headReceived = 0, bodyReceived = 0,
        downloaded = 0, partial = 0, cache = 0;

    for (let i = 0, len = data.entries.length; len > i; ++i) {
        // Compute data to display the action type piechart.
        blocked +=  data.entries[i].timings.blocked;
        dns += data.entries[i].timings.dns;
        connect += data.entries[i].timings.connect;
        send += data.entries[i].timings.send;
        wait += data.entries[i].timings.wait;
        receive += data.entries[i].timings.receive;

        // Compute data to display the languages and technologies used.
        if (data.entries[i].response.content.mimeType.search('html') != -1) {
            html += data.entries[i].response.bodySize;
        }
        else if (data.entries[i].response.content.mimeType.search('javascript') != -1) {
            javascript += data.entries[i].response.bodySize;
        }
        else if (data.entries[i].response.content.mimeType.search('css') != -1) {
            css += data.entries[i].response.bodySize;
        }
        else if (data.entries[i].response.content.mimeType.search('image') != -1) {
            image += data.entries[i].response.bodySize;
        }
        else if (data.entries[i].response.content.mimeType.search('flash') != -1) {
            flash += data.entries[i].response.bodySize;
        }
        else {
            others += data.entries[i].response.bodySize;
        }

        // Compute data to display the headers and bodies.
        headSent +=  data.entries[i].request.headersSize;
        bodySent += data.entries[i].request.bodySize;
        headReceived += data.entries[i].response.headersSize;
        bodyReceived += data.entries[i].response.bodySize;

        // Compute data to display the headers and bodies.
        //partial += data.entries[i].response.bodySize;
        if (data.entries[i].cache.afterRequest !== undefined)
            cache += data.entries[i].response.bodySize;
        else
            downloaded +=  data.entries[i].response.bodySize;
    }

    return [
        chart.controller({
            width:  100,
            height: 100,
            title: "Summary of request times",
            parts:
            [
                { title: `Blocked`,   value: (blocked > 0 ? blocked : 0),   color: colors.blocked },
                { title: `DNS`,       value: (dns > 0 ? dns : 0),           color: colors.dns },
                { title: `SSL/TLS`,   value: 0,                             color: colors.ssl },
                { title: `Connect`,   value: (connect > 0 ? connect : 0),   color: colors.connect },
                { title: `Send`,      value: (send > 0 ? send : 0),         color: colors.send },
                { title: `Wait`,      value: (wait > 0 ? wait : 0),         color: colors.wait },
                { title: `Receive`,   value: (receive > 0 ? receive : 0),   color: colors.receive }
            ]
        }),
        chart.controller({
            width:  100,
            height: 100,
            title: "Summary of content types",
            parts:
            [
                { title: `HTML/Text`,   value: (html > 0 ? html : 0) / 100,               color: colors.html },
                { title: `JavaScript`,  value: (javascript > 0 ? javascript : 0) / 100,   color: colors.javascript },
                { title: `CSS`,         value: (css > 0 ? css : 0) / 100,                 color: colors.css },
                { title: `Image`,       value: (image > 0 ? image : 0)  / 100,            color: colors.image },
                { title: `Flash`,       value: (flash > 0 ? flash : 0) / 100,             color: colors.flash },
                { title: `Others`,      value: (others > 0 ? others : 0) / 100,           color: colors.others }
            ]
        }),
        chart.controller({
            width:  100,
            height: 100,
            title: "Sent and received bodies & headers",
            parts:
            [
                { title: `Headers Sent`,      value: (headSent > 0 ? headSent : 0),           color: colors.headSent },
                { title: `Bodies Sent`,       value: (bodySent > 0 ? bodySent : 0),           color: colors.bodySent },
                { title: `Headers Received`,  value: (headReceived > 0 ? headReceived : 0),   color: colors.headReceived },
                { title: `Bodies Received`,   value: (bodyReceived > 0 ? bodyReceived : 0),   color: colors.bodyReceived }
          ]
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

// Render every charts.
const view = (ctrl) => {
    return m('div.row', [
        ctrl.map((chartCtrl, index) => {
            return m('div.col-md-3.col-sm-6.col-xs-12.piecharts', [
                m('h6.row', chartCtrl.title),
                // Render pie charts.
                m('div.row', chart.view(chartCtrl)),
                    // Render a table to display details about pie chart data.
                chartCtrl.parts.map(part => {
                    return m('div.row.piechart-table', [
                            m('div.col-xs-6', part.title),
                            m('div.col-xs-6', (index > 0 ? sizePrecision(part.value) : timePrecision(part.value)))
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
