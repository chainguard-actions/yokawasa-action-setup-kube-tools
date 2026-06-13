// ESLint v9+ config migrated from .eslintrc.json and .eslintignore
import js from '@eslint/js';
import github from 'eslint-plugin-github';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig} */
export default [
  js.configs.recommended,
  {
    plugins: {
      github,
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      'eslint-comments/no-use': 'off',
      'import/no-namespace': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-ignore': 'error',
      'camelcase': 'off',
      '@typescript-eslint/camelcase': 'error',
      '@typescript-eslint/class-name-casing': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/func-call-spacing': ['error', 'never'],
      '@typescript-eslint/generic-type-naming': ['error', '^[A-Z][A-Za-z]*$'],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-object-literal-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
    },
    ignores: [
      'dist/',
      'lib/',
      'node_modules/',
    ],
    extends: [
      'plugin:github/es6',
    ],
  },
];
