module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'expo',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'react-native/no-raw-text': 'off',
    'react-native/sort-styles': 'error',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-unused-styles': 'error',
    'react/no-unescaped-entities': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
            message:
              'React 17以降ではコンポーネントで "import React from \'react\'" は不要です。特定のReactのインポートが必要な場合は、"import { useState, useEffect } from \'react\'" のように名前付きインポートを使用してください。',
          },
        ],
      },
    ],
  },
  env: {
    'react-native/react-native': true,
  },
  overrides: [
    {
      files: ['database.types.ts'],
      rules: {
        '@typescript-eslint/no-redundant-type-constituents': 'off',
      },
    },
  ],
}
