export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  moduleNameMapper: {
    '^#(.*)\\.js$': '<rootDir>/src/$1',
    '^#(.*)$': '<rootDir>/src/$1'
  },
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }],
  },
  
  transformIgnorePatterns: [
    '/node_modules/(?!(knex|pg)/)',
    'node_modules/(?!(p-limit)/)'
  ],
  
  testMatch: ['**/tests/**/*.test.ts'],

};