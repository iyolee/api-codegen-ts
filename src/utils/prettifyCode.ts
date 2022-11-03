import prettier from 'prettier';

export const prettifyCode = (code: string) =>
  prettier.format(code, {
    printWidth: 120,
    trailingComma: 'all',
    arrowParens: 'always',
    parser: 'typescript'
  });
