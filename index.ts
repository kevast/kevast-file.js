import * as fs from 'fs';
import {Pair} from 'kevast/dist/nodejs/Pair';
import {IAsyncStorage} from 'kevast/dist/nodejs/Storage';
const fsAsync = fs.promises;

export = class KevastMemory implements IAsyncStorage {
  private path: fs.PathLike;
  public constructor(path: fs.PathLike) {
    if (typeof path !== 'string' && !(path instanceof Buffer) && !(path instanceof URL)) {
      throw new TypeError('Illegal path: only path-like is accepted.');
    }
    try {
      const stat = fs.statSync(path);
      if (!stat.isFile()) {
        throw new Error('Illegal path: only path of file is accepted.');
      }
    } catch (err) {
      if (!(err instanceof Error)) { throw err; }
      if (!err.message.startsWith('ENOENT: no such file or directory')) { throw err; }
    }
    this.path = path;
  }
  public async clear() {
    await this.writeFile('');
  }
  public async has(key: string): Promise<boolean> {
    const data = await this.readFile();
    return key in data;
  }
  public async delete(key: string) {
    const data = await this.readFile();
    if (key in data) {
      delete data[key];
      await this.writeFile(data);
    }
  }
  public async entries(): Promise<Iterable<Pair>> {
    const data = await this.readFile();
    return Object.entries(data);
  }
  public async get(key: string): Promise<string> {
    const data = await this.readFile();
    return data[key];
  }
  public async keys(): Promise<Iterable<string>> {
    const data = await this.readFile();
    return Object.keys(data);
  }
  public async set(key: string, value: string) {
    const data = await this.readFile();
    data[key] = value;
    await this.writeFile(data);
  }
  public async size(): Promise<number> {
    const data = await this.readFile();
    return Object.keys(data).length;
  }
  public async values(): Promise<Iterable<string>> {
    const data = await this.readFile();
    return Object.values(data);
  }
  private async readFile(): Promise<any> {
    let content: string;
    try {
      content = (await fsAsync.readFile(this.path)).toString();
    } catch (err) {
      if (!(err instanceof Error)) { throw err; }
      if (err.message !== 'ENOENT: no such file or directory') { throw err; }
      content = '';
    }
    return JSON.parse(content);
  }
  private async writeFile(data: any): Promise<void> {
    await fsAsync.writeFile(this.path, JSON.stringify(data));
  }
};
