module.exports = {
    parser: '@typescript-eslint/parser',
    extends: 'airbnb',
    plugins: [
    ],
    env: {
        // Browser global variables like `window` etc.
        browser: true,
        // CommonJS global variables and CommonJS scoping. Allows require, exports and module.
        commonjs: true,
        // Enable all ECMAScript 6 features except for modules.
        es6: true,
        // Defines things like process.env when generating through node
        node: true,
    },
    rules: {
        'eol-last': 'error',
        'default-param-last': 'off',
        // Disabling 'import/no-unresolved' since typescript will break first
        'import/no-unresolved': 'off',
        'import/extensions': ['error', 'never'],
        indent: ['warn', 4],
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
        semi: ['warn', 'never'],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    root: true,
}
