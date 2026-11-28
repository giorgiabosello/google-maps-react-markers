import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// airbnb and the plugins below only ship the old config format: FlatCompat turns it into a flat config.
const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) })

export default [
	{ ignores: ['dist/**', 'docs/**', 'node_modules/**'] },
	...compat
		.config({
			env: {
				browser: true,
				es2021: true,
				es6: true,
				node: true,
			},
			extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks', 'prettier'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			plugins: [
				'react',
				'@typescript-eslint',
				'typescript-sort-keys',
				'unused-imports',
				'prettier',
				'prefer-arrow',
				'sort-class-members',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': 'error',
				'import/extensions': 'off',
				'import/no-extraneous-dependencies': 'off',
				'import/no-unresolved': 'off',
				'import/prefer-default-export': 'off',
				'no-nested-ternary': 'off',
				'no-plusplus': 'off',
				'no-unused-vars': 'off',
				'no-use-before-define': 'off',
				'prettier/prettier': [
					'error',
					{
						endOfLine: 'auto',
					},
				],
				'react/destructuring-assignment': 'off',
				'react/function-component-definition': 'off',
				'react/jsx-filename-extension': 'off',
				'react/jsx-props-no-spreading': 'off',
				'react/react-in-jsx-scope': 'off',
				'react/require-default-props': 'off',
				'typescript-sort-keys/interface': 'error',
				'typescript-sort-keys/string-enum': 'error',
				'unused-imports/no-unused-imports': 'error',
				'prefer-arrow/prefer-arrow-functions': [
					'error',
					{
						disallowPrototype: true,
						singleReturnOnly: true,
						classPropertiesAllowed: false,
					},
				],
				'sort-class-members/sort-class-members': [
					'error',
					{
						order: [
							'[static-properties]',
							'[properties]',
							'[conventional-private-properties]',
							'constructor',
							'[static-methods]',
							'[methods]',
							'[conventional-private-methods]',
						],
						accessorPairPositioning: 'getThenSet',
					},
				],
			},
			globals: {
				globalThis: 'readonly',
				google: 'readonly',
			},
		})
		.map((config) => ({ ...config, files: ['src/**/*.{ts,tsx}'] })),
]
