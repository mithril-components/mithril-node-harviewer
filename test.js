'use strict'

const render = require('mithril-node-render')
const harviewer   = require('./harviewer');

const ctrl = harviewer.controller({/* TODO: HAR */});

var view = harviewer.view(ctrl);

console.log(render(view));
