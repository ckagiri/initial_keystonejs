const path = require('path');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

global.__base = __dirname;
const Config = require(`${global.__base}/config/Config`);
const conf = new Config();

module.exports = {
    name: 'app',
    resolve: {
        modules: [
            path.resolve(__dirname, 'client/home/features'),
            'node_modules'
        ]
    },
    entry: {
        main: [
            'babel-polyfill',
            path.join(__dirname, './client/home/index.js')
        ],
        vendor: [
            'react',
            'react-dom',
            'react-redux',
            'react-router-redux',
            'react-router-dom',
            'redux-thunk',
            'redux'
        ]
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/js/'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            FB_ID: conf.facebookAppId,
            FBPAGE_ID: conf.facebookPageId,
            FBPAGE_URL: JSON.stringify(conf.facebookPage),
            GOOGLE_MAP_API_KEY: JSON.stringify(conf.googleMapApiKey),
            GOOGLE_RECAPTCHA_SITEKEY: JSON.stringify(conf.googleRecaptchaSiteKey),
        }),
        new UglifyJsPlugin({
            sourceMap: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
