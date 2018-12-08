import assert = require('assert');
import Kevast = require('kevast');
import * as tmp from 'tmp';
import KevastFile = require('../index');

describe('Test basic function', () => {
  let kevast: Kevast;
  let tempFile: tmp.SynchrounousResult;
  before(() => {
    tempFile = tmp.fileSync();
    kevast = new Kevast(new KevastFile(tempFile.name));
  });

  it('Get', async () => {
    assert(await kevast.get('key1') === null);
    assert(await kevast.get('key1', 'default') === 'default');
  });
  it('Set', async () => {
    await kevast.set('key1', 'value1');
    assert(await kevast.get('key1') === 'value1');
  });
  it('Has', async () => {
    assert(await kevast.has('key1') === true);
    assert(await kevast.has('key2') === false);
  });
  it('Size', async () => {
    await kevast.set('key2', 'value2');
    await kevast.set('key3', 'value3');
    await kevast.set('key4', 'value4');
    assert(await kevast.size() === 4);
  });
  it('Delete', async () => {
    assert(await kevast.has('key4') === true);
    await kevast.delete('key4');
    assert(await kevast.has('key4') === false);
  });
  it('Entries', async () => {
    const source = [...await kevast.entries()];
    const target = [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']];
    assert.deepStrictEqual(source, target);
  });
  it('Keys', async () => {
    const source = [...await kevast.keys()];
    const target = ['key1', 'key2', 'key3'];
    assert.deepStrictEqual(source, target);
  });
  it('Values', async () => {
    const source = [...await kevast.values()];
    const target = ['value1', 'value2', 'value3'];
    assert.deepStrictEqual(source, target);
  });
  it('Clear', async () => {
    await kevast.clear();
    assert(await kevast.size() === 0);
  });
  after(() => {
    tempFile.removeCallback();
  });
});
