import rootConfig from '../eslint.config.js';
import globals from 'globals';

export default [
    ...rootConfig,
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'no-console': 'off', // Allow console in server
        },
    },
];
