'use strict'

const fs            = require('fs');
const render        = require('mithril-node-render');
const harviewer     = require('./harviewer');

// const harFile = JSON.parse(fs.readFileSync("./hars/errorhar.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/errorhar2.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har(1).json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har(2).json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har(3).json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har(4).json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har(5).json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/test-har-bing.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/test-har.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/report.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/crosswalk.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/crosswalk2.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/baidu.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/baidu2.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/baidu3.json", 'UTF-8'));
// const harFile = JSON.parse(fs.readFileSync("./hars/har.json", 'UTF-8'));
const harFile = JSON.parse(fs.readFileSync("./hars/zh-luckyvitamin.json", 'UTF-8'));

const ctrl = harviewer.controller(harFile);
const view = harviewer.view(ctrl);

const innerHtml = render(view);

console.log(innerHtml);