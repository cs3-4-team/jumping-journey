module.exports = {
  root: true,
  plugins: ['@stylistic'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['.eslintrc.cjs', 'node_modules/'],
  rules: {
    'prettier/prettier': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['node_modules/**'],
            importNamePattern: '.'
          }
        ]
      }
    ],
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-tabs': 'error',
    '@stylistic/lines-between-class-members': ['error', 'always'],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/semi-spacing': 'error',
    '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
    '@stylistic/semi-style': ['error', 'last'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/semi': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['const', 'let'] },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let'] },
      { blankLine: 'always', prev: 'block', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'class', next: '*' },
      { blankLine: 'always', prev: '*', next: 'class' },
      { blankLine: 'always', prev: 'for', next: '*' },
      { blankLine: 'always', prev: '*', next: 'for' },
      { blankLine: 'always', prev: '*', next: 'iife' },
      { blankLine: 'always', prev: 'iife', next: '*' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'switch', next: '*' },
      { blankLine: 'always', prev: '*', next: 'switch' },
      { blankLine: 'always', prev: 'try', next: '*' },
      { blankLine: 'always', prev: '*', next: 'try' },
      { blankLine: 'always', prev: 'while', next: '*' },
      { blankLine: 'always', prev: '*', next: 'while' }
    ],
    'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }]
  }
};
