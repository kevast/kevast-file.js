import * as fs from 'fs';
import { MutationEvent, Storage } from 'kevast/dist/Storage';

interface NameToValueMap {
    [key: string]: string | undefined;
}

export class KevastFile implements Storage {
  private path: fs.PathLike;
  private cache: NameToValueMap;
  public constructor(path: fs.PathLike) {
    if (typeof path !== 'string' && !(path instanceof Buffer) && !(path instanceof URL)) {
      throw new TypeError('Path must be a string, buffer or url.');
    }
    this.path = path;
    let content: string;
    try {
      content = fs.readFileSync(this.path).toString();
    } catch (err) {
      if (err.message.startsWith('ENOENT: no such file or directory')) {
        content = '{}';
      } else {
        throw err;
      }
    }
    this.cache = JSON.parse(content || '{}');
  }
  public async mutate(event: MutationEvent): Promise<void> {
    for (const pair of event.set) {
      this.cache[pair.key] = pair.value;
    }
    for (const key of event.removed) {
      delete this.cache[key];
    }
    if (event.clear) {
      this.cache = {};
    }
    await new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(this.cache), (err) => {
        if (err) { reject(err); } else { resolve(); }
      });
    });
  }
  public get(key: string): string | undefined {
    return this.cache[key];
  }
}
