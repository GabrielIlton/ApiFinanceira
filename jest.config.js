module.exports = {
  roots: ['<rootDir>/__test__'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  coverageProvider: 'v8'
};