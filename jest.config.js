module.exports = {
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    moduleNameMapper: {
      // Handle module aliases (if you have them in your webpack config)
      '^@components/(.*)$': '<rootDir>/src/components/$1',
    },
    testEnvironment: 'jsdom',
  };