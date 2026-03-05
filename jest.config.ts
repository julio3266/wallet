import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!main.ts', '!**/*.module.ts'],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  testEnvironment: 'node',
};

export default config;
