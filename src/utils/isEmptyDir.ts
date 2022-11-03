import * as fs from 'fs';

export function isEmptyDir(fPath: string) {
  var pa = fs.readdirSync(fPath);
  if (pa.length === 0) {
    return true;
  } else {
    return false;
  }
}
