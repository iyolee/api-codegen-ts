import { CaseType } from "../types/common";

// 下划线转换驼峰
export function toHump(name: string) {
  if (typeof name !== 'string') return name;
  return name.replace(/\_(\w)/g, (_, letter) => {
    return letter.toUpperCase();
  });
}

// 驼峰转换下划线
export function toLine(name: string) {
  if (typeof name !== 'string') return name;
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function changeParametersCase(
  data: any,
  type: CaseType | undefined
) {
  if (!Array.isArray(data)) return data;
  const res = (data || []).map((item: { [k: string]: 'string' }) => {
    if (type === 'camel') {
      return {
        ...item,
        name: toHump(item.name)
      };
    } else if (type === 'snake') {
      return {
        ...item,
        name: toLine(item.name)
      };
    }
    return item;
  });
  return res;
}

export function changeKeyCase(key: string, type: CaseType | undefined) {
  if (typeof key !== 'string') return key;
  let res = key;
  if (type === 'camel') {
    res = toHump(key);
  } else if (type === 'snake') {
    res = toLine(key);
  }
  return res;
}
