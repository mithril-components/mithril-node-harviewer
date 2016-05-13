'use strict'

const render 	  = require('mithril-node-render');
const component = require('./componentname');

const model = {/* sample data */};

const ctrl = component.controller(model);
const view = component.view(ctrl);
const innerHtml = render(view);
console.log(innerHtml);
