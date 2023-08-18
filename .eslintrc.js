module.exports = {
  parser: '@typescript-eslint/parser',
  extends: 'airbnb',
  plugins: [
  ],
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    node: true, // Defines things like process.env when generating through node
  },
  rules: {
    'eol-last': 'error',
    'default-param-last': 'off',
    'import/no-unresolved': 'error',
    'indent': ['warn', 4],
    'linebreak-style': ['error', 'unix'],
    'max-classes-per-file': 'off',
    'no-console': ['warn'],
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent-props': ['warn', 4],
    'react/jsx-indent': ['warn', 4],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'semi': ['warn', 'never'],
  },
  root: true,
};
