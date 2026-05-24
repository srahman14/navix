/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  roots: ['<rootDir>/'],

  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],

  moduleFileExtensions: ['ts', 'js', 'json'],

  collectCoverageFrom: [
    'services/**/*.ts',
    'controllers/**/*.ts',
    'utils/**/*.ts',
    '!**/*.d.ts'
  ],

  coverageDirectory: 'coverage',

  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
