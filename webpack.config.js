var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');
var webpack = require('webpack');

var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: './client.js',
    output: {
        path: path.join(__dirname, 'static', 'js'),
        filename: 'client.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets:['es2015', 'react']
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              'style-loader',
              'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
              'postcss-loader'
            )
        }]
    },
    resolve: {
        root: __dirname,
    },
    postcss: function () {
        return [autoprefixer()];
    },
    plugins: [
        new ExtractTextPlugin(path.join('..', 'css', 'client.css'), {
            allChunks: true
        }),
        //new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
