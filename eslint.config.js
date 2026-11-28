import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['**/dist/**', '**/out/**', '**/.next/**', '**/.source/**', '**/coverage/**', '**/next-env.d.ts'],
	},
	js.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	reactHooks.configs.flat.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser, google: 'readonly' },
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		},
	},
	{
		files: ['**/test/**'],
		rules: {
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['**/*.config.{js,ts,mjs}', '**/scripts/**'],
		languageOptions: { globals: globals.node },
	},
	prettier,
)
