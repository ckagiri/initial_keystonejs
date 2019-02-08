// store the base path
global.__base = __dirname;

var Config = require(global.__base + '/config/Config');
var conf = new Config();

var KeystoneMode = require(global.__base + '/enum/KeystoneMode');

// Require keystone
var keystone = require('keystone');

var fs = require('fs');
var Utility = require(global.__base + '/helper/Utility');

var dbUrl = 'mongodb://' + conf.dbHost + '/' + conf.dbName;
var isCMS = !(conf.keystoneMode === KeystoneMode.api.key);

if (conf.dbAuthEnable) {
    dbUrl =
        'mongodb://' +
        conf.dbUser +
        ':' +
        conf.dbPassword +
        '@' +
        conf.dbHost +
        '/' +
        conf.dbName +
        conf.dbOptions
}

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({
    name: 'React Keystonejs',
    brand: 'React Keystonejs',
    mongo: dbUrl,
    port: conf.port,

    // ssl: true,
    // 'ssl key': '/etc/ssl/server-key.pem',
    // 'ssl cert': '/etc/ssl/server-cert.pem',
    // 'ssl ca': '/etc/ssl/cert.pem',

    sass: 'public',
    static: 'public',
    favicon: 'public/favicon.ico',
    views: 'templates/views',
    'view engine': 'pug',

    'auto update': isCMS,
    'session store': 'mongo',
    'session store options': {
        ttl: 60 * 60
    },
    session: isCMS,
    auth: isCMS,
    'user model': 'User',
    headless: !isCMS,
    'admin path': conf.adminPath,
    'cookie secret':
        'P8@D/30,Svd1TL1a6]17%;t6QM13>4:OEbu3o#K8bTu>;SRT-!mFeK1plGjan5a',
    enhancedList: [],
    'wysiwyg additional plugins': 'textcolor colorpicker',
	'wysiwyg additional buttons': 'forecolor backcolor fontsizeselect',
	'wysiwyg additional options': {
		fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 30px 36px"
	}
});

keystone.enhancedList = function enhancedList(name) {
    if (name) {
        return keystone
            .get('enhancedList')
            .find(enhancedList => enhancedList.name === name.toLowerCase());
    }
    return keystone.get('enhancedList');
};

// setup cloudary account
// keystone.set('cloudinary config', {
//     cloud_name: conf.cloudinaryCloudName,
//     api_key: conf.cloudinaryApiKey,
//     api_secret: conf.cloudinaryApiSecret
// });
// will prefix all built-in tags
// keystone.set('cloudinary prefix', conf.cloudinaryFolder);
// will prefix each image public_id with [{prefix}]/{list.path}/{field.path}/
// keystone.set('cloudinary folders', true);
// keystone.set('signin logo', '/images/icon/mtgamerlogo.png');
// keystone.set('meta logo', '/images/icon/mtgamerlogo.png');
// console.log(keystone.get('meta image'));
// Load your project's Models
keystone.import('models');

// Load your project's plugins' Models
const pluginPath = `${global.__base}/plugins`;
try {
    const plugins = Utility.getDirectories(pluginPath);
    plugins.forEach(plugin => {
        try {
            keystone.import(`plugins/${plugin}/models`);
        } catch (err) {
            console.log('Plugins models not exist!');
        }
    });
} catch (err) {
    console.log('Plugins folder not exist!');
}

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable
});

// Load your project's Routes
keystone.set('routes', require('./routes'));
keystone.set('pre:dynamic', require('./routes/bindBodyParser')); // this is required for audit-trail plugin; should be removed/implemented in other way.
keystone.set('pre:static', require('./routes/admin'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    users: ['users'],
    // common: ['users'],
    // member: [
    //     'Member',
    //     'ProfilePicture',
    //     'BackgroundPicture',
    //     'ProfilePicturePool',
    //     'ChatMessage',
    //     // 'ChatPicture',
    //     'Country',
    //     'City',
    //     'Region',
    //     'AuthCode'
    // ],
    // game: ['Game', 'Rule', 'Server'],
    // competition: ['Match', 'Tournament', 'Participant', 'Leaderboard', 'Prize', 'Sponsor'],
    // sponsor: 'Sponsor',
    // prize: 'Prize',
    // newsFeed: 'News',
    // content: ['HomeDynamicContent', 'Slide', 'StaticPage', 'TermsAndConditions'],
});

// Start Keystone to connect to your database and initialise the web server

keystone.start({
    onHttpsServerCreated: () => {
        // const tournamentNotifyUserService = require(global.__base + '/services/tournamentNotifyUserService');
        // const DailyService = require(global.__base + '/services/DailyService');
        // const LuckyDrawRecord = require(global.__base + '/services/LuckyDrawRecord');
        // tournamentNotifyUserService();
        // new DailyService();
        // new LuckyDrawRecord();
	},
	onHttpServerCreated: () => {
        // service module
        // const tournamentNotifyUserService = require(global.__base + '/services/tournamentNotifyUserService');
        // const DailyService = require(global.__base + '/services/DailyService');
        // const LuckyDrawRecord = require(global.__base + '/services/LuckyDrawRecord');
        // tournamentNotifyUserService();
        // new DailyService();
        // new LuckyDrawRecord();
	}
});
