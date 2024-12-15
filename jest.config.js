module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/.eslintrc.js',
    '<rootDir>/main.ts',
    '<rootDir>/utils/',
    '<rootDir>/database/',
    '\\.interface\\.ts$',
    '\\.module\\.ts$',
    '\\.config\\.ts$',
    '\\.dto\\.ts$',
    '\\.entity\\.ts$',
  ],
};
