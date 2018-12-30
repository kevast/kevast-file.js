import assert = require('assert');
import * as fs from 'fs';

export async function basicTest() {
  // Set
  await this.kevast.set('key1', 'value1');
  await this.kevast.set('key2', 'value2');
  await this.kevast.set('key3', 'value3');
  assert(fs.readFileSync(this.path).toString() === JSON.stringify([
    ['key1', 'value1'],
    ['key2', 'value2'],
    ['key3', 'value3'],
  ]));
  // Delete
  await this.kevast.delete('key1');
  assert(fs.readFileSync(this.path).toString() === JSON.stringify([
    ['key2', 'value2'],
    ['key3', 'value3'],
  ]));
  // Clear
  await this.kevast.clear();
  assert(fs.readFileSync(this.path).toString() === JSON.stringify([]));
}
