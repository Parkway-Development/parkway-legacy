// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ['node_modules/', 'dist/', '.prettierrc.cjs']
  },
  {
    settings: {
      react: {
        version: 'detect' // Automatically detect the version of React to use
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'react/jsx-uses-react': 'off', // Not needed with React 17+ (new JSX transform)
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ (new JSX transform)
      'react/prop-types': 'off', // Disable prop-types as we use TypeScript for type checking
      'jsx-a11y/no-static-element-interactions': 'error', // Example of a custom rule setting
      'jsx-a11y/click-events-have-key-events': 'error',
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'error' // Checks effect dependencies
    }
  }
);
