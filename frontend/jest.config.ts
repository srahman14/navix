// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  collectCoverage: true,
  coverageDirectory: 'test-reports/',
  coverageReporters: ['html'],
  collectCoverageFrom: ['**/components/**/*.{js,jsx,ts,tsx}', '**/app/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default createJestConfig(config);