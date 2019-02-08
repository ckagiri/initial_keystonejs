const keystone = require('keystone');
const path = require('path');
const webpack = require('webpack');

const packages = require('keystone/admin/client/packages.js');

module.exports = {
    name: 'admin',
    resolve: {
        modules: [path.resolve('./client/adminui/lib'), 'node_modules'],
        alias: {
            react: path.join(
                __dirname,
                'node_modules/keystone/node_modules/react'
            ),
            'react-router': path.join(
                __dirname,
                'node_modules/keystone/node_modules/react-router'
            ),
            'react-dom': path.join(
                __dirname,
                'node_modules/keystone/node_modules/react-dom'
            )
        }
    },
    entry: {
        admin: [
            'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr_admin&name=admin&reload=false',
            path.join(__dirname, './client/adminui/App/index.js')
        ],
        signin: [
            'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr_admin&name=admin&reload=false',
            path.join(__dirname, './client/adminui/Signin/index.js')
        ],
        vendor: packages
    },
    output: {
        path: path.join(__dirname, 'public', keystone.get('admin path'), 'js'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: `/${keystone.get('admin path')}/js/`
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'packages.js'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            FIELD_TYPES: JSON.stringify(keystone.fieldTypes)
        }),
        new webpack.ProvidePlugin({
            _: 'underscore'
        }),
        new webpack.IgnorePlugin(/^underscore$/)
    ],
    externals: {
        jquery: 'jQuery',
        tinymce: 'tinymce',
        codemirror: 'codemirror'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'client/adminui'),
                    path.resolve(__dirname, 'plugins'),
                    path.resolve(__dirname, 'node_modules/keystone')
                ],
                use: {
                    loader: 'babel-loader',
                },
            }
        ]
    }
};
