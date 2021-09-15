"use strict";

import webpack from 'webpack';
import { merge } from 'webpack-merge';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import baseConfig from './webpack.config.base';
import { templateParameters } from './tools/webpack-utils';
import { InjectManifest } from 'workbox-webpack-plugin';


const port = 3000;
const publicPath = `http://localhost:${port}/`;

export default merge(baseConfig, {

	mode: 'development',

	devtool: 'eval-source-map', // see https://webpack.js.org/configuration/devtool/#devtool

	entry: {
		index: [
			// injected automatically by the webpack-dev-server (see devServer.hot/client)
			// `webpack-dev-server/client?http://localhost:${port}/`,
			// 'webpack/hot/only-dev-server',
			path.join(__dirname, 'app/index'),
		],
		another: [
			// injected automatically by the webpack-dev-server (see devServer.hot/client)
			// `webpack-dev-server/client?http://localhost:${port}/`,
			// 'webpack/hot/only-dev-server',
			path.join(__dirname, 'app/another'),
		],
		// handled the InjectManifest plugin
		// sw: [
		// 	path.join(__dirname, 'app/sw/sw'),
		// ],
	},

	output: {
		publicPath,
	},

	module: {
		rules: [
			{
				test: /\.css?$/,
				use: [
					'style-loader',
					'css-loader',
				],
				include: [
					path.resolve(__dirname, 'app'),
				],
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					// https://github.com/bholloway/resolve-url-loader/blob/v5/packages/resolve-url-loader/README.md
					'resolve-url-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								parser: 'postcss-scss',
								plugins: function () {
									return [autoprefixer];
								},
							},
						},
					},
				],
				include: [
					path.resolve(__dirname, 'app'),
				],
			},
		],
	},

	// https://github.com/gaearon/react-hot-loader#react--dom
	// it is really needed, otherwise React Apollo won't trigger rerenders on proxy changes
	resolve: {
		alias: {
			'react-dom': '@hot-loader/react-dom',
		},
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: true,
		}),
		// automatically injected by the webpack-dev-server (when devServer.hot is true or 'only'))
		// new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			__DEV__: true,
			// note: it seems that to get rid out of the process/browser.js shim
			//       'process': false is also required
			//       maybe it is related to discussion in https://github.com/webpack/webpack/issues/798
			'process': false,
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
		// see https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
		// see https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest#InjectManifest
		new InjectManifest({
			swSrc: path.join(__dirname, 'app/sw/sw'),
			injectionPoint: 'self.__WB_MANIFEST',
			maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
			exclude: [
				/LICENSE/,
				/_headers/,
				/_redirects/,
				/robots\.txt/,
				/\.map$/,
			],
			manifestTransforms: [
				async (manifestEntries) => {

					const manifest = manifestEntries.map(entry => {

						if (entry.url.endsWith('index.html')) {
							entry.url = entry.url.slice(0, -10);
						}

						return entry;

					});

					return { manifest, warnings: [] };

				},
			],
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './app/template.ejs',
			templateParameters,
			chunks: ['index'],
			xhtml: true,
		}),
		new HtmlWebpackPlugin({
			filename: 'another.html',
			template: './app/another.html',
			chunks: ['another'],
			xhtml: true,
		}),
	],

	optimization: {
		emitOnErrors: false,
	},

	devServer: {

		// currently, we use v4.x
		// see the docs at https://webpack.js.org/configuration/dev-server/

		// host: '0.0.0.0',
		port,

		hot: 'only',
		client: {
			// see https://webpack.js.org/configuration/dev-server/#devserverclient
			overlay: {
				errors: true,
				warnings: false,
			},
			webSocketURL: 'auto://0.0.0.0:0/ws',
		},

		historyApiFallback: true,
		static: [
			{
				directory: path.join(__dirname, 'data'),
				publicPath: '/data/',
				// https://github.com/expressjs/serve-index
				serveIndex: false,
				watch: false,
			},
		],

		// currently, not needed
		// headers: {
		// 	'Access-Control-Allow-Origin': '*',
		// },

		// unnecessary
		// devMiddleware: {
		// 	publicPath,
		// },

	},

});
