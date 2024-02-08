module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: ["react-app", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	rules: {
		"no-prototype-builtins": "off",
		"no-mixed-spaces-and-tabs": "off",
		"no-func-assign": "off",
		"no-extend-native": "off",
		"react/jsx-no-target-blank": "off",
		"react/display-name": "off",
		"react-hooks/exhaustive-deps": "off",
		"import/no-anonymous-default-export": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-ts-comment": "off"
	}
}
