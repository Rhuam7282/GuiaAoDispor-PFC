// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }], // 'warn' é melhor para dev
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
  'import/resolver': {
    alias: {
      map: [
        ['@', './src'],
        ['@componentes', './src/componentes'],
        ['@paginas', './src/paginas'],
        ['@recursos', './src/recursos']
      ],
      extensions: ['.js', '.jsx']
    }
  }
},
  },
]