"use strict";

// AVA configuration
// see https://github.com/avajs/ava
// see https://github.com/avajs/ava/blob/master/docs/06-configuration.md#configuration
// see https://github.com/avajs/ava/blob/master/docs/06-configuration.md#avaconfigjs

// TODO: consider using precompiled tests/sources

// noinspection JSUnusedGlobalSymbols
export default {
	// see https://github.com/avajs/ava/blob/master/docs/recipes/babel.md
	// see https://github.com/avajs/babel
	babel: {
		compileEnhancements: false, // we add them ourselves below via @ava/babel/transform-test-files
		extensions: [
			'ts',
		],
		testOptions: {
			babelrc: false,
			configFile: false,
			presets: [
				[
					'module:@ava/babel/stage-4',
					false,
				],
				[
					'@babel/preset-env',
					{
						targets: {
							node: 'current',
						},
						// see https://babeljs.io/docs/en/babel-preset-env#browserslist-integration
						ignoreBrowserslistConfig: true,
						useBuiltIns: 'usage',
						corejs: 3,
						debug: false,
					},
				],
				'@babel/preset-typescript',
				// '@babel/preset-react',
				'@ava/babel/transform-test-files',
			],
		},
	},
	files: [
		'test/**/*',
	],
	// to see what triggered the the rests to rerun:
	//   DEBUG=ava:watcher npx ava --verbose --watch
	ignoredByWatcher: [
		'**/.idea/**/*', // .idea/workspace.xml is changed on every file edit
		'**/node_modules/**/*',
		'temp/**/*',
		'dist/**/*',
	],
	require: [
		// this will transpile all source code files (app/
		'./test/_register.js',
	],
};
