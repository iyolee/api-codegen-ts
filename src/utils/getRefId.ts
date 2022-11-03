export const getRefId = (str?: string): string => {
  if (!str) {
    return '';
  }
  const list = str.split('/');
  return list[list.length - 1];
};
