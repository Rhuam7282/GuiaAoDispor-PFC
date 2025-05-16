// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react' // <--- IMPORTADO
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // Simplificado
      globals: {
        ...globals.browser,
        // Se banco.js ou outros arquivos Node estiverem no escopo do lint:
        // ...globals.node,
      },
      parserOptions: {
        // ecmaVersion já está acima
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react': pluginReact, // <--- ADICIONADO
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules, // <--- ADICIONADO
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }], // 'warn' é melhor para dev
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // Não necessário com React 17+ e Vite
      'react/prop-types': 'off', // Desligue se não usar PropTypes (comum com TS ou se não precisar)
    },
    settings: { // <--- ADICIONADO para eslint-plugin-react
      react: {
        version: 'detect', // Detecta a versão do React instalada
      },
    },
  },
]