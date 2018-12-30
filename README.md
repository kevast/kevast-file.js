# kevast-file.js
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
  const kevast = await Kevast.create(new KevastFile('./test.json'));
  await kevast.set('key', 'value');
  assert(kevast.get('key') === 'value');
})();
```
