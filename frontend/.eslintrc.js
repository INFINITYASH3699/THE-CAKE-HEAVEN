module.exports = {
    extends: ['next', 'next/core-web-vitals'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // change from 'error' to 'warn'
      '@typescript-eslint/no-unused-vars': 'warn',  // change from 'error' to 'warn'
      'react-hooks/exhaustive-deps': 'warn',        // change from 'error' to 'warn'
    }
  };