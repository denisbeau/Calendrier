export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "@swc/jest",
  },
  setupFiles: ["<rootDir>/src/setupTests.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  extensionsToTreatAsEsm: [".jsx"],
  transformIgnorePatterns: [
    // allowlist ESM packages that need transformation
    "/node_modules/(?!(@testing-library/jest-dom|msw|@mswjs|until-async|text-encoding|web-streams-polyfill)/)",
  ],
  testMatch: [
    "**/__tests__/**/*.(js|jsx)",
    "**/*.(test|spec).(js|jsx)",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/**/__tests__/**",
    "!src/setupTests.js",
    "!src/main.jsx",
    "!src/**/*.config.{js,jsx}",
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      branches: 75,
      functions: 75,
      statements: 75,
    },
  },
};
