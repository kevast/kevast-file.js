import * as fs from 'fs';
import {Pair} from 'kevast/dist/nodejs/Pair';
import {IAsyncStorage} from 'kevast/dist/nodejs/Storage';

export = class KevastFile implements IAsyncStorage {
  private path: fs.PathLike;
  private cache: any;
  public constructor(path: fs.PathLike) {
    if (typeof path !== 'string' && !(path instanceof Buffer) && !(path instanceof URL)) {
      throw new TypeError('Illegal path: only path-like is accepted.');
    }
    let content: string;
    // Read file content
    try {
      content = fs.readFileSync(path).toString();
    } catch (err) {
      // Only process path not exist, throw the error otherwise
      if (!(err instanceof Error)) { throw err; }
      if (!err.message.startsWith('ENOENT: no such file or directory')) { throw err; }
      // init content
      content = '{}';
    }
    // Parse file content
    try {
      this.cache = JSON.parse(content);
    } catch (err) {
      // Only process JSON parse problem, throw the error otherwise
      if (!(err instanceof Error)) { throw err; }
      if (!err.message.startsWith('Unexpected end of JSON input')) { throw err; }
      // if JSON parse fail because content is empty (read an empty file)
      if (content === '') {
        this.cache = {};
      }
    }
    this.path = path;
  }
  public async clear() {
    this.cache = {};
    await this.writeFile();
  }
  public async has(key: string): Promise<boolean> {
    return key in this.cache;
  }
  public async delete(key: string) {
    if (key in this.cache) {
      delete this.cache[key];
      await this.writeFile();
    }
  }
  public async entries(): Promise<Iterable<Pair>> {
    return Object.entries(this.cache);
  }
  public async get(key: string): Promise<string> {
    return this.cache[key];
  }
  public async keys(): Promise<Iterable<string>> {
    return Object.keys(this.cache);
  }
  public async set(key: string, value: string) {
    this.cache[key] = value;
    await this.writeFile();
  }
  public async size(): Promise<number> {
    return Object.keys(this.cache).length;
  }
  public async values(): Promise<Iterable<string>> {
    return Object.values(this.cache);
  }
  private async writeFile(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(this.cache), (err) => {
        if (err) { reject(err); } else { resolve(); }
      });
    });
  }
};
