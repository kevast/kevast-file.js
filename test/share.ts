import assert = require('assert');

export async function basicTest() {
  // Get
  assert(await this.kevast.get('key1') === null);
  assert(await this.kevast.get('key1', 'default') === 'default');
  // Set
  await this.kevast.set('key1', 'value1');
  assert(await this.kevast.get('key1') === 'value1');
  // Has
  assert(await this.kevast.has('key1') === true);
  assert(await this.kevast.has('key2') === false);
  // Size
  await this.kevast.set('key2', 'value2');
  await this.kevast.set('key3', 'value3');
  await this.kevast.set('key4', 'value4');
  assert(await this.kevast.size() === 4);
  // Delete
  assert(await this.kevast.has('key4') === true);
  await this.kevast.delete('key4');
  assert(await this.kevast.has('key4') === false);
  // Entries
  assert.deepStrictEqual(
    [...await this.kevast.entries()],
    [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']],
  );
  // Keys
  assert.deepStrictEqual(
    [...await this.kevast.keys()],
    ['key1', 'key2', 'key3'],
  );
  // Values
  assert.deepStrictEqual(
    [...await this.kevast.values()],
    ['value1', 'value2', 'value3'],
  );
  // Clear
  await this.kevast.clear();
  assert(await this.kevast.size() === 0);
}
