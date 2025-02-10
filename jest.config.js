module.exports = {
    testMatch: ['**/?(*.)+(spec|test).ts'],
  
    preset: 'ts-jest',
    testEnvironment: 'node',
  
    moduleDirectories: ['node_modules', 'src'],
  
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
  