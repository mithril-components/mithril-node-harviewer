#!/usr/bin/env node
'use strict'

// Load required modules
const m           = require('mithril');



const controller = (page, entry, colors) => {
    return ({
        width:              90,
        height:             20,
        onLoad:             page.onLoad ? page.onLoad : 0,
        onContentLoad:      page.onContentLoad ? page.onContentLoad : 0,
        startedDateTime:    Date.parse(entry.startedDateTime) - Date.parse(page.startedDateTime),
        value:              entry.time,
        parts: [
            {
                // DNS
                value: entry.timings.dns,
                color: colors.dns
            },
            {
                // CONNECT
                value: entry.timings.connect,
                color: colors.connect
            },
            {
                // SEND
                value: entry.timings.send,
                color: colors.send
            },
            {
                // WAIT
                value: entry.timings.wait,
                color: colors.wait
            },
            {
                // RECEIVE
                value: entry.timings.receive,
                color: colors.receive
            }
        ],
    })
}


const view = (ctrl) => {
    let startedDateTime = ctrl.startedDateTime;
    return m('svg', {
        width:          '100%',
        height:         ctrl.height,
        xmlns:          'http://www.w3.org/2000/svg',
        'xmlns:xlink':  'http://www.w3.org/1999/xlink'
    }, [
        m('rect', {
            x:              0,
            y:              0,
            width:          '100%',
            height:         ctrl.height,
            'stroke-width': 1,
            stroke:         '#000',
            opacity:        0.3,
            fill:           'none'
        }),
        // Draw every request phase time.
        ctrl.parts.map((map) => {
            const start = startedDateTime;
            startedDateTime += (map.value < 0 ? 0 : map.value);
            return m('rect', {
                x:         (ctrl.width * start) / ctrl.onLoad + '%',
                y:         0,
                width:     (ctrl.width * map.value) / ctrl.onLoad + '%',
                height:    ctrl.height,
                fill:      map.color
            });
        }),
        // Display the request time.
        m('text', {
            x:      (ctrl.width * startedDateTime) / ctrl.onLoad + 1 + '%',
            y:      ctrl.height * 3 / 4
        }, (ctrl.value > 1000 ? ((ctrl.value / 1000).toPrecision(2) + ' s') : (ctrl.value + ' ms'))),
        // Draw the stroke showing when the page is loaded.
        m('line', {
            x1:             ctrl.width + '%',
            y1:             0,
            x2:             ctrl.width + '%',
            y1:             20,
            'stroke-width': 0.3,
            stroke:         'red'
        }),
        // Draw the stroke showing when the DOM is loaded.
        m('line', {
            x1:             (ctrl.width * ctrl.onContentLoad) / ctrl.onLoad + '%',
            y1:             0,
            x2:             (ctrl.width  * ctrl.onContentLoad) / ctrl.onLoad + '%',
            y1:             20,
            'stroke-width': 0.3,
            stroke:         'blue'
        })
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}
