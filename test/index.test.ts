import assert = require('assert');
import * as fs from 'fs';
import { Kevast } from 'kevast';
import * as tmp from 'tmp';
import { KevastFile } from '../index';

let path: string;
let kevast: Kevast;

describe('Test basic function', () => {
  it('Invalid path', () => {
    assert.throws(() => {
      const _ = new KevastFile(1 as any as string);
    }, new TypeError('Path must be a string, buffer or url.'));
  });
  it('Path not exist', async () => {
    path = tmp.tmpNameSync();
    kevast = new Kevast(new KevastFile(path));
    await basicTest();
  });
  it('Directory path', async () => {
    const dir = tmp.dirSync();
    assert.throws(() => {
      const _ = new KevastFile(dir.name);
    }, new Error('EISDIR: illegal operation on a directory, read'));
    dir.removeCallback();
  });
  it('File with invalid content', async () => {
    path = tmp.tmpNameSync();
    fs.writeFileSync(path, '#$%%&^%^&');
    assert.throws(() => {
      const _ = new KevastFile(path);
    }, new SyntaxError('Unexpected token # in JSON at position 0'));
    fs.unlinkSync(path);
  });
  it('File exists but empty', async () => {
    const tempFile = tmp.fileSync();
    path = tempFile.name;
    kevast = new Kevast(new KevastFile(path));
    await basicTest();
    tempFile.removeCallback();
  });
  it('Init with data', async () => {
    path = tmp.tmpNameSync();
    const data = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    fs.writeFileSync(path, JSON.stringify(data));
    kevast = new Kevast(new KevastFile(path));
    assert(await kevast.get('key1') === 'value1');
    assert(await kevast.get('key2') === 'value2');
    assert(await kevast.get('key3') === 'value3');
    fs.unlinkSync(path);
  });
  it('Error Handle', async () => {
    path = tmp.tmpNameSync();
    fs.writeFileSync(path, '');
    kevast = new Kevast(new KevastFile(path));
    fs.unlinkSync(path);
    fs.mkdirSync(path);
    assert.rejects(async () => {
      await kevast.set('key', 'value');
    }, {
      message: /^EISDIR: illegal operation on a directory, open/,
      name: 'Error',
    });
    fs.rmdirSync(path);
  });
});

async function basicTest() {
  // Set
  await kevast.set('key1', 'value1');
  await kevast.set('key2', 'value2');
  await kevast.set('key3', 'value3');
  assert(fs.readFileSync(path).toString() === JSON.stringify({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }));
  // Delete
  await kevast.remove('key1');
  assert(fs.readFileSync(path).toString() === JSON.stringify({
    key2: 'value2',
    key3: 'value3',
  }));
  // Clear
  await kevast.clear();
  assert(fs.readFileSync(path).toString() === JSON.stringify({}));
}
