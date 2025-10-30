export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "@swc/jest",
  },
  setupFiles: ["<rootDir>/src/tests/setup/text-encoder.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  extensionsToTreatAsEsm: [".jsx"],
  transformIgnorePatterns: [
    // allowlist ESM packages that need transformation
    "/node_modules/(?!(@testing-library/jest-dom|msw|@mswjs|until-async|text-encoding|web-streams-polyfill)/)",
  ],
};
