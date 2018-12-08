import assert = require('assert');
import * as fs from 'fs';
import Kevast = require('kevast');
import * as tmp from 'tmp';
import KevastFile = require('../index');
import {basicTest} from './share';

describe('Test basic function', () => {
  it('Path not exist', async () => {
    const name = tmp.tmpNameSync();
    this.kevast = new Kevast(new KevastFile(name));
    await basicTest.call(this);
  });
  it('Directory path given', async () => {
    const dir = tmp.dirSync();
    assert.throws(() => {
      const kevast = new Kevast(new KevastFile(dir.name));
    });
    dir.removeCallback();
  });
  it('File with invalid content given', () => {
    const name = tmp.tmpNameSync();
    fs.writeFileSync(name, '#$%%&^%^&');
    assert.throws(() => {
      const kevast = new Kevast(new KevastFile(name));
    });
    fs.unlinkSync(name);
  });
  it('File path given', async () => {
    const tempFile = tmp.fileSync();
    this.kevast = new Kevast(new KevastFile(tempFile.name));
    await basicTest.call(this);
    tempFile.removeCallback();
  });
  it('File path buffer given', async () => {
    const tempFile = tmp.fileSync();
    const buffer = Buffer.from(tempFile.name);
    this.kevast = new Kevast(new KevastFile(buffer));
    await basicTest.call(this);
    tempFile.removeCallback();
  });
  it('File url given', async () => {
    const tempFile = tmp.fileSync();
    const url = new URL(`file://${tempFile.name}`);
    this.kevast = new Kevast(new KevastFile(url));
    await basicTest.call(this);
    tempFile.removeCallback();
  });
});
