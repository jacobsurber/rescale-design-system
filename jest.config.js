export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.story.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/demo/**/*',
    '!src/stories/**/*',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/storybook-static/',
    '/coverage/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@demo/(.*)$': '<rootDir>/src/demo/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
        },
        isolatedModules: true,
      },
    ],
  },
  testTimeout: 10000,
  // For handling dynamic imports and ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(@ant-design|antd|@babel|@storybook)/)',
  ],
  // Accessibility testing setup
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};