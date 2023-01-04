const config = {
  root: true,
  ignorePatterns: ['*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  plugins: [
    'simple-import-sort',
    'sort-keys-fix',
    'sort-destructure-keys',
    '@typescript-eslint',
  ],
  rules: {
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': 'warn',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-destructure-keys/sort-destructure-keys': 'warn',
    'no-restricted-imports': 'off',
    //https://eslint.org/docs/latest/rules/no-restricted-imports
    //https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-restricted-imports.md#allowtypeimports
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: ['.*'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.spec.tsx',
          '*.config.*.ts',
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'react/display-name': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver:': {
      typescript: true,
      node: true,
    },
  },
}

module.exports = config
