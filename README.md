# kevast-file.js
[![Build Status](https://img.shields.io/travis/kevast/kevast-file.js.svg?style=flat-square)](https://travis-ci.org/kevast/kevast-file.js)
[![Coverage Status](https://img.shields.io/coveralls/github/kevast/kevast-file.js.svg?style=flat-square)](https://coveralls.io/github/kevast/kevast-file.js?branch=master)
[![Dependencies](https://img.shields.io/david/kevast/kevast-file.js.svg?style=flat-square)](https://david-dm.org/kevast/kevast-file.js)
[![Dev Dependencies](https://img.shields.io/david/dev/kevast/kevast-file.js.svg?style=flat-square)](https://david-dm.org/kevast/kevast-file.js?type=dev)
[![Package Version](https://img.shields.io/npm/v/kevast-file.svg?style=flat-square)](https://www.npmjs.com/package/kevast-file)
[![Open Issues](https://img.shields.io/github/issues-raw/kevast/kevast-file.js.svg?style=flat-square)](https://github.com/kevast/kevast-file.js/issues)
[![MIT License](https://img.shields.io/npm/l/kevast-file.svg?style=flat-square)](https://github.com/kevast/kevast-file.js/blob/master/LICENSE)

A file storage for [kevast.js](https://github.com/kevast/kevast.js).

## Installation
Using yarn
```bash
yarn add kevast-file
```

Using npm
```bash
npm install kevast-file
```

## Usage
```javascript
const { Kevast } = require('kevast');
const { KevastFile } = require('kevast-file');

(async () => {
  const kevast = new Kevast(new KevastFile('./test.json'));
  await kevast.set('key', 'value');
  assert(await kevast.get('key') === 'value');
})();
```
