module.exports = {
  testEnvironment: "jest-environment-jsdom", // Explicitly specify the jsdom environment
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Use babel-jest to transform TypeScript and JSX
  },
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/src/utils/$1", // Map module aliases
    "^@components/(.*)$": "<rootDir>/src/components/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Extend Jest with Testing Library matchers
};
