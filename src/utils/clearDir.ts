import * as fs from 'fs';

export function clearDir(path: string) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file: string, index: number) => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        clearDir(curPath); // 递归删除文件夹
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    });
    // fs.rmdirSync(path);
  }
}
