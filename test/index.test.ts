import assert = require('assert');
import * as fs from 'fs';
import { Kevast } from 'kevast';
import * as tmp from 'tmp';
import { KevastFile } from '../index';
import { basicTest } from './share';

describe('Test basic function', () => {
  it('Path not exist', async () => {
    this.path = tmp.tmpNameSync();
    this.kevast = await Kevast.create(new KevastFile(this.path));
    assert(this.kevast.size() === 0);
    await basicTest.call(this);
  });
  it('Directory path given', async () => {
    const dir = tmp.dirSync();
    try {
      await Kevast.create(new KevastFile(dir.name));
    } catch (err) {
      assert(err.message === 'EISDIR: illegal operation on a directory, read');
    }
    dir.removeCallback();
  });
  it('File with invalid content given', async () => {
    this.path = tmp.tmpNameSync();
    fs.writeFileSync(this.path, '#$%%&^%^&');
    try {
      const kevast = await Kevast.create(new KevastFile(this.path));
    } catch (err) {
      assert(err.message.startsWith('Unexpected token'));
    }
    fs.unlinkSync(this.path);
  });
  it('File path given', async () => {
    const tempFile = tmp.fileSync();
    this.path = tempFile.name;
    this.kevast = await Kevast.create(new KevastFile(this.path));
    assert(this.kevast.size() === 0);
    await basicTest.call(this);
    tempFile.removeCallback();
  });
  it('File path buffer given', async () => {
    const tempFile = tmp.fileSync();
    this.path = tempFile.name;
    const buffer = Buffer.from(this.path);
    this.kevast = await Kevast.create(new KevastFile(buffer));
    assert(this.kevast.size() === 0);
    await basicTest.call(this);
    tempFile.removeCallback();
  });
  it('File url given', async () => {
    const tempFile = tmp.fileSync();
    this.path = tempFile.name;
    const url = new URL(`file://${this.path}`);
    this.kevast = await Kevast.create(new KevastFile(url));
    assert(this.kevast.size() === 0);
    await basicTest.call(this);
    tempFile.removeCallback();
  });
  it('Init with data', async () => {
    this.path = tmp.tmpNameSync();
    const data = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
    ];
    fs.writeFileSync(this.path, JSON.stringify(data));
    this.kevast = await Kevast.create(new KevastFile(this.path));
    assert(this.kevast.size() === data.length);
    assert.deepStrictEqual([...this.kevast.entries()], data);
    fs.unlinkSync(this.path);
  });
});
