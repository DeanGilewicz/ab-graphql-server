module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest", // allows the use of modern ECMAScript features
		sourceType: "module", // allows for the use of imports
	},
	extends: ["plugin:@typescript-eslint/recommended"], // uses the linting rules from @typescript-eslint/eslint-plugin
	env: {
		node: true, // enable Node.js global variables
	},
};
