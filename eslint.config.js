import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files   : ['**/*.{js,jsx}'],
    plugins : {
      react,
      'react-hooks': reactHooks
    },
    languageOptions: {
      ecmaVersion : 2022,
      sourceType  : 'module',
      globals     : {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types'       : 'off',
      'react/react-in-jsx-scope' : 'off',
      'no-unused-vars'         : ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  },
  {
    ignores: ['build/**', 'node_modules/**']
  }
]
