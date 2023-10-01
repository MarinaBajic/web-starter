const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webfontsGenerator = require('webfonts-generator');

const fs = require('fs');
const allSvg = [];
const allSvgImages = fs.readdirSync('./src/assets/svg');
allSvgImages.forEach((file) => {
	allSvg.push('./src/assets/svg/' + file);
});

module.exports = {
	mode: 'development',
	entry: ['./src/scss/style.scss', './src/js/script.js'],
	output: {
		filename: 'js/script.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['autoprefixer'],
							},
						},
					},
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/style.css',
		}),
		new StylelintPlugin({
			configFile: '.stylelintrc.json',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: 'src/assets',
					to: 'assets',
				},
				{
					from: 'src/index.html',
					to: '',
				},
			],
		}),
	],
};

webfontsGenerator(
	{
		files: allSvg,
		dest: 'src/assets/fonts',
		cssDest: 'src/scss/base/_icon-font.scss',
		cssFontsUrl: '../assets/fonts/',
	},
	function (error) {
		if (error) {
			console.log('Fail!', error);
		} else {
			console.log('Done!');
		}
	},
);
