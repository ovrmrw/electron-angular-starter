module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/server/__tests__/**/*.spec.ts'],
  setupFiles: ['<rootDir>/node_modules/reflect-metadata']
};
