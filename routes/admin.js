const middleware = require('./middleware');

var Config = require(global.__base + '/config/Config');
var conf = new Config();

var KeystoneMode = require(global.__base + '/enum/KeystoneMode');

module.exports = function createAdminRoute(app) {

    if (process.env.NODE_ENV !== 'production' || conf.keystoneMode == KeystoneMode.cms.key) {
        app.use(middleware.webpackDevMiddleware('admin'));
        app.use(middleware.webpackHotMiddleware('admin'));
    }
};
