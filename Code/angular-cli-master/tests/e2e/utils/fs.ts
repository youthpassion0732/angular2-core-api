import * as fs from 'fs';
import * as rimrafPackage from 'rimraf';
import {dirname} from 'path';
import {stripIndents} from 'common-tags';


export function readFile(fileName: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err: any, data: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function writeFile(fileName: string, content: string, options?: any) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(fileName, content, options, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function deleteFile(path: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function rimraf(path: string) {
  return new Promise<void>((resolve, reject) => {
    rimrafPackage(path, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  }
}


export function moveFile(from: string, to: string) {
  return new Promise<void>((resolve, reject) => {
    fs.rename(from, to, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function createDir(path: string) {
  _recursiveMkDir(path);
}


function _recursiveMkDir(path: string) {
  if (fs.existsSync(path)) {
    return Promise.resolve();
  } else {
    return _recursiveMkDir(dirname(path))
      .then(() => fs.mkdirSync(path));
  }
}

export function copyFile(from: string, to: string) {
  return _recursiveMkDir(dirname(to))
    .then(() => new Promise((resolve, reject) => {
      const rd = fs.createReadStream(from);
      rd.on('error', (err) => reject(err));

      const wr = fs.createWriteStream(to);
      wr.on('error', (err) => reject(err));
      wr.on('close', (ex) => resolve());

      rd.pipe(wr);
    }));
}


export function writeMultipleFiles(fs: { [path: string]: string }) {
  return Promise.all(Object.keys(fs).map(fileName => writeFile(fileName, fs[fileName])));
}


export function replaceInFile(filePath: string, match: string, replacement: string);
export function replaceInFile(filePath: string, match: RegExp, replacement: string) {
  return readFile(filePath)
    .then((content: string) => writeFile(filePath, content.replace(match, replacement)));
}


export function appendToFile(filePath: string, text: string, options?: any) {
  return readFile(filePath)
    .then((content: string) => writeFile(filePath, content.concat(text), options));
}


export function prependToFile(filePath: string, text: string, options?: any) {
  return readFile(filePath)
    .then((content: string) => writeFile(filePath, text.concat(content), options));
}


export function expectFileToExist(fileName: string) {
  return new Promise((resolve, reject) => {
    fs.exists(fileName, (exist) => {
      if (exist) {
        resolve();
      } else {
        reject(new Error(`File ${fileName} was expected to exist but not found...`));
      }
    });
  });
}

export function expectFileToMatch(fileName: string, regEx: RegExp | string) {
  return readFile(fileName)
    .then(content => {
      if (typeof regEx == 'string') {
        if (content.indexOf(regEx) == -1) {
          throw new Error(stripIndents`File "${fileName}" did not contain "${regEx}"...
            Content:
            ${content}
            ------
          `);
        }
      } else {
        if (!content.match(regEx)) {
          throw new Error(stripIndents`File "${fileName}" did not contain "${regEx}"...
            Content:
            ${content}
            ------
          `);
        }
      }
    });
}

export function expectFileSizeToBeUnder(fileName: string, sizeInBytes: number) {
  return readFile(fileName)
    .then(content => {
      if (content.length > sizeInBytes) {
        throw new Error(`File "${fileName}" exceeded file size of "${sizeInBytes}".`);
      }
    });
}
