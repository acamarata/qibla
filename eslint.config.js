import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { typescript } from '@acamarata/eslint-config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  {
    files: ['src/**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['src/**/*.ts'],
    ...typescript.reduce((acc, cfg) => ({ ...acc, ...cfg }), {}),
  },
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/', '*.cjs', '*.mjs', 'tsup.config.ts', 'eslint.config.js'],
  },
];
