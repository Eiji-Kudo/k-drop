import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores(["coverage", "dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			react.configs.flat.recommended,
			react.configs.flat["jsx-runtime"],
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			importPlugin.flatConfigs.recommended,
			importPlugin.flatConfigs.typescript,
		],
		languageOptions: {
			ecmaVersion: "latest",
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unused-vars": "error",
			"max-lines": ["error", { max: 100, skipBlankLines: true, skipComments: true }],
			"import/no-unresolved": "off",
			"no-restricted-imports": [
				"error",
				{
					paths: [
						{
							name: "react",
							importNames: ["default"],
							message:
								"React 17以降ではコンポーネントで \"import React from 'react'\" は不要です。必要な場合は名前付きインポートを使用してください。",
						},
					],
				},
			],
			"react/react-in-jsx-scope": "off",
			"unused-imports/no-unused-imports": "error",
		},
	},
	{
		files: ["functions/**/*.ts", "src/lib/api/**/*.ts"],
		languageOptions: {
			globals: {
				...globals.worker,
			},
		},
		rules: {
			"react-refresh/only-export-components": "off",
		},
	},
	{
		files: ["**/*.test.ts", "**/*.test.tsx"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.vitest,
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-assertions": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/unbound-method": "off",
		},
	},
]);
