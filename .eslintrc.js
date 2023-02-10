module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prefer-const': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Package nest related
          ['^@nest'],
          // Other lib
          ['^@?\\w'],
          // Internal package
          [
            '^@(common|module|config|log|database|auth|microservice|middleware)(/.*|$)',
          ],
          // Parent import
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Same relative import
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'simple-import-sort',
  ],
  settings: {
    'import/resolver': {
      node: {
        map: [
          ['@src', './src'],
          ['@common', './src/common'],
          ['@config', './src/config'],
          ['@database', './src/database'],
          ['@log', './src/log'],
          ['@module', './src/module'],
          ['@microservice', './src/microservice'],
          ['@middleware', './src/middleware'],
        ],
        extensions: ['.ts'],
      },
    },
  },
};
