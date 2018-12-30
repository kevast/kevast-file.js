import * as fs from 'fs';
import { IMutationEvent, IStorage } from 'kevast/dist/Storage';

export class KevastFile implements IStorage {
  private path: fs.PathLike;
  public constructor(path: fs.PathLike) {
    if (typeof path !== 'string' && !(path instanceof Buffer) && !(path instanceof URL)) {
      throw new TypeError('Path must be a string, buffer or url.');
    }
    this.path = path;
  }
  public async current(): Promise<Map<string, string>> {
    let content: string;
    // Read file content
    try {
      content = await new Promise((resolve, reject) => {
        fs.readFile(this.path, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString());
          }
        });
      });
    } catch (err) {
      if (err.message.startsWith('ENOENT: no such file or directory')) {
        content = '[]';
      } else {
        throw err;
      }
    }
    return new Map(JSON.parse(content || '[]'));
  }
  public async mutate(event: IMutationEvent) {
    await new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify([...event.current]), (err) => {
        if (err) { reject(err); } else { resolve(); }
      });
    });
  }
}
