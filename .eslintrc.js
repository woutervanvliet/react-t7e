module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: [
  ],
  rules: {
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent-props': ['error', 'tab'],
    'react/jsx-indent': ['error', 'tab'],
    'no-underscore-dangle': 'off',
    'semi': ['warn', 'never'],
    'indent': ['error', 'tab'],
    'no-tabs': ['error', {
      allowIndentationTabs: true,
    }],
    'import/no-unresolved': {
      peerDependencies: true,
    },
  },
};
