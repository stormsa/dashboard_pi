const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const outputPath = path.join(__dirname, "dist")
const port = process.env.PORT || 3000;

module.exports = {
	context: __dirname,
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		modules: ['node_modules', './src'],
		extensions: ['.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader!sass-loader'
				}),
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader'
				}),
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle.css"),
	],
	devServer: {
		port,
		historyApiFallback: true,
		publicPath: '/dist/',
	}
}