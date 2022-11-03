import * as fs from 'fs';
import * as path from 'path';
import { hasHttpOrHttps } from '../utils/hasHttpOrHttps';
import { fetchRemoteSpec } from '../utils/fetchRemoteSpec';
import { toJSONObj } from '../utils/toJSONObj';
import { CustomSpec } from '../types/common';

export const importSpec = async (
  importPath: string,
  outputDir: string,
  basePath: string
) => {
  let fileType = '';
  let resData;
  if (hasHttpOrHttps(importPath)) {
    const res = await handleRemoteApiSpec(importPath);
    fileType = res?.fileType ?? '';
    resData = res?.data;
  } else {
    const res = handleLocalApiSpec(importPath);
    fileType = res.fileType;
    resData = res?.data;
  }

  const validFileType = ['json'];
  if (!validFileType.includes(fileType)) {
    console.log('for the time being, only json file import is supported.');
    process.exit(1);
  }

  const specData: CustomSpec = toJSONObj(resData);
  let curBasePath = basePath ? basePath : (specData?.basePath ?? '');
  if (curBasePath[curBasePath.length - 1] === '/') {
    curBasePath = curBasePath.slice(0, curBasePath.length - 1);
  }
  const paths = Object.keys(specData?.paths ?? {}).reduce((acc, cur) => {
    const source = cur.replace(curBasePath, '').split('/')[1];
    if (Object.prototype.hasOwnProperty.call(acc, source)) {
      acc[source][cur] = specData?.paths[cur];
    } else {
      acc[source] = {
        [cur]: specData?.paths[cur],
      };
    }
    return acc;
  }, {});
  writeSpecToFile(outputDir, paths, specData);
};

function writeSpecToFile(
  outputDir: string,
  paths: { [key: string]: any },
  specData: CustomSpec
) {
  Object.keys(paths).forEach((key) => {
    const newSpecData = {
      ...specData,
      paths: paths[key]
    };
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    try {
      fs.writeFileSync(
        path.resolve(outputDir, `./${key}.json`),
        JSON.stringify(newSpecData, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error("writing to json file error: ", error);
    }
  });
}

async function handleRemoteApiSpec(specPath: string) {
  const { data, fileType } = (await fetchRemoteSpec(specPath)) || {};
  const getResponseData = () => data;
  return {
    fileType,
    data: getResponseData()
  };
}

function handleLocalApiSpec(specPath: string) {
  const fileType = path.extname(specPath).split('.')[1];
  const getFileStr = () => fs.readFileSync(specPath, 'utf8');
  return {
    fileType,
    data: getFileStr()
  };
}
