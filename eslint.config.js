import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config([
    { ignores: ['**/dist/**', '**/node_modules/**'] },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
]);
