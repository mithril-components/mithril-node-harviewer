'use strict'

const fs            = require('fs');
const render        = require('mithril-node-render');
const harviewer     = require('./harviewer');

const harFile = JSON.parse(fs.readFileSync("har.json", 'UTF-8'));

const ctrl = harviewer.controller(harFile);
const view = harviewer.view(ctrl);

const innerHtml = render(view);

console.log(innerHtml);