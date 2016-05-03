'use strict'

const component = require('./componentname');

const ctrl = component.controller(data);
const view = component.view(ctrl);
const innerHtml = render(view);
console.log(innerHtml);
