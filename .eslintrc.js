module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: [
  ],
  rules: {
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': 'off',
    'no-underscore-dangle': 'off',
    'import/no-unresolved': {
      peerDependencies: true,
    },
  },
};
