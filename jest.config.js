module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Alias for src directory
    '\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    '\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js', // Mock file imports
  },
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest for transformation
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleDirectories: ['node_modules', 'src'],
};
