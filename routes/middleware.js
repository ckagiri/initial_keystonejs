/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');

const Config = require(`${global.__base}/config/Config`);
const conf = new Config();
const AppEnv = require(`${global.__base}/enum/AppEnv`);

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function initLocals(req, res, next) {
    res.locals.navLinks = [{ label: 'Home', key: 'home', href: '/' }];
    res.locals.user = req.user;
    next();
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function flashMessages(req, res, next) {
    const messages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };
    res.locals.messages = _.some(messages, msgs => msgs.length)
        ? messages
        : false;
    next();
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function requireUser(req, res, next) {
    if (!req.user) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/keystone/signin');
    } else {
        next();
    }
};

const isDevelopment = !(conf.appEnv === AppEnv.production.key);
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
var KeystoneMode = require(global.__base + '/enum/KeystoneMode');

if (isDevelopment || conf.keystoneMode == KeystoneMode.cms.key) {
    const webpackDevMiddlewares = {};
    const webpackHotMiddlewares = {};

    const createWebpackMiddleware = function createWebpackMiddleware(
        name,
        config,
        hotMiddlewareOptions
    ) {
        const compiler = webpack(config);
        const middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
            stats: {
                colors: true,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });

        webpackDevMiddlewares[name] = middleware;
        webpackHotMiddlewares[name] = webpackHotMiddleware(
            compiler,
            hotMiddlewareOptions
        );
    };

    createWebpackMiddleware('app', require('./../webpack.config.js'));
    createWebpackMiddleware('admin', require('./../webpack.admin.config.js'), {
        path: '/__webpack_hmr_admin'
    });

    exports.webpackDevMiddleware = function webpackDevMiddleware(name) {
        return webpackDevMiddlewares[name];
    };

    exports.webpackHotMiddleware = function webpackHotMiddleware(name) {
        return webpackHotMiddlewares[name];
    };
}
