export const getFilename = (basePath?: string) =>
  basePath ? `${basePath.split('/').join('.').slice(1)}` : '';
