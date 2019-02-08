/**
 *
 */

const keystone = require('keystone');

const keystoneHash = keystone.createKeystoneHash();
const writeToDisk = keystone.get('cache admin bundles');
const browserify = require('keystone/admin/server/middleware/browserify');

const createPreStaticRoute = function createPreStaticRoute(app) {
    /* Prepare browserify bundles */
    const bundles = {
        signin: browserify({
            file: './../../../../client/adminui/Signin/index.js',
            hash: keystoneHash,
            writeToDisk
        }),
        admin: browserify({
            file: './../../../../client/adminui/App/index.js',
            hash: keystoneHash,
            writeToDisk
        })
    };

    // prebuild static resources on the next tick
    // improves first-request performance
    process.nextTick(() => {
        bundles.signin.build();
        bundles.admin.build();
    });
    app.all(
        `/${keystone.get('admin path')}/js/signin.js`,
        bundles.signin.serve
    );
    app.all(`/${keystone.get('admin path')}/js/admin.js`, bundles.admin.serve);
};

exports = createPreStaticRoute;
module.exports = createPreStaticRoute;
