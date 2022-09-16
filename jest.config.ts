import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	moduleNameMapper: { "^src/(.*)": "<rootDir>/src/$1" },
	transform: {
		"^.+\\.(ts|tsx)?$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	extensionsToTreatAsEsm: [".ts"],
	// globalSetup: "<rootDir>/src/setupTestEnv.ts",
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	testEnvironment: "node",
	testMatch: ["<rootDir>/**/*.test.(ts)"],
	// reporters: ["default", "jest-summary-reporter"],
	cacheDirectory: "<rootDir>/.jest-cache",
	// watchPathIgnorePatterns: ["node_modules"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname",
	],
	// collectCoverage: true,
	collectCoverageFrom: [
		"src/resolvers/**",
		"!src/resolvers/index.ts",
		"!src/resolvers/**/index.ts",
	],
	// coveragePathIgnorePatterns: [
	// 	"<rootDir>/src/app/main.ts",
	// ],
	coverageDirectory: "<rootDir>/coverage/",
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
};

export default config;
