module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:eslint-comments/recommended',
  ],
  rules: {
    'no-console': 'warn',
    'object-shorthand': 'error',
    'prettier/prettier': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': ['error', { caseSensitiveStrict: true }],
    'import/prefer-default-export': 'off',
    'import/no-duplicates': 'error',
    complexity: ['error', 8],
    'max-lines': ['error', 200],
    'max-depth': ['error', 3],
    'max-params': ['error', 4],
    eqeqeq: ['error', 'smart'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-shadow': ['error', { hoist: 'all' }],
    'prefer-const': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@apdupius/*/*'],
            message:
              'import of internal modules must be done at the root level.',
          },
        ],
        paths: [
          {
            name: 'lodash',
            message: 'Please use lodash/{module} import instead',
          },
          {
            name: '.',
            message: 'Please use explicit import file',
          },
        ],
      },
    ],
    curly: ['error', 'all'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/accessible-emoji': 'off',
    'risxss/catch-potential-xss-react': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-key': 'warn',
    'react/iframe-missing-sandbox': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  },
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  plugins: [
    'prefer-arrow',
    'import',
    'prettier',
    'unused-imports',
    'react',
    'jsx-a11y',
    'react-hooks',
    'risxss',
    'eslint-comments',
  ],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
      },
      settings: { 'import/resolver': { typescript: {} } },
      rules: {
        '@typescript-eslint/prefer-optional-chain': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowNullableBoolean: true,
          },
        ],
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            minimumDescriptionLength: 10,
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/camelcase': 'off',
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              FC: 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              SFC: 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              FunctionComponent:
                'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.FC':
                'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.SFC':
                'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.FunctionComponent':
                'Use `const MyComponent = (props: Props): JSX.Element` instead',
            },
            extendDefaults: true,
          },
        ],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unnecessary-type-arguments': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
  ],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['**/coverage/*.js'],
};
