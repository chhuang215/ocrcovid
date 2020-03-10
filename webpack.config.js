// webpack v4
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

// var fs = require('fs');
 
// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function (x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function (mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
    entry: path.resolve('./src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    target: "node",
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
      },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: [{loader: "html-loader"}]
            }
        ],
        
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // filename: './index.html'
        }),
        new CleanWebpackPlugin(),
    ],
    externals: [ nodeExternals()],
    // watch: NODE_ENV === 'development'
    resolve: {
        extensions: [".ts", ".js"],
    },
};