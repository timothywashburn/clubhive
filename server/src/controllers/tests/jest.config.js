export const testEnvironment = 'node';
export const transform = {
    '^.+\\.(ts|tsx)$': 'babel-jest', // Use babel-jest for .ts and .tsx files
};
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js|jsx)$';
