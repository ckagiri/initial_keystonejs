const _ = require('lodash');

const AppEnv = require(`${global.__base}/enum/AppEnv`);
const KeystoneMode = require(`${global.__base}/enum/KeystoneMode`);
const ClientPlatform = require(`${global.__base}/enum/ClientPlatform`);

// Common setting for all environment
const commonSetting = {
    port: 3026,
    // challongeApiKey: 'WNZkWWCUdDJwLPjJBk7cTT6ONHc568oUwWEP6qAe',
    // challongeRequestUrl: 'https://api.challonge.com/v1/',
    cloudinaryCloudName: 'nicwong',
    cloudinaryApiKey: '138636196414786',
    cloudinaryApiSecret: 'tT6Fwl4OJXAYD270ynXZrVEwITA',
    recaptchaSecret: '6Ldl_i4UAAAAAI4WalGMwfxLvXlCiPTRARPDyU2W',
    dbOptions: '',
    adminPath: 'admin',
    googleMapApiKey: 'AIzaSyCZTSMrrnxk6NYB8XSP_wxCpN-2ZYOhTI4',
    googleRecaptchaSiteKey: '6Ld0NzoUAAAAANeDbweopiDmF91DCmq5m8G3rCq6',

    smtpUsername: 'AKIAICSRVAGCFWCVXCWQ',
	smtpPassword: 'Apb7pr53Ri8KMwc+3mTrledJy0TVnSRa0PvZt+Gz1wnq',
    smtpHost: 'email-smtp.us-east-1.amazonaws.com',
    twilioSID: 'ACeb1a4b5f21a728ac4f481d5e84f88f03',
	twilioAuthToken: 'aa8d99296bd7ba07c354e33e55cd68eb',
	twilioOwnNum: '+85264507130',

    //leancloud
    leancloudAppId: 'GmFLPIY7wMloC7w5XFMr0CXi-gzGzoHsz',
    leancloudAppKey: 'gzpWbRLmgPtMl8OixoicCN49',
    leancloudMasterKey: 'hybKBx6mnnWEUu7ViXzEPCtn',

    imageSize: 5000000,     // 5MB
    imageMineType: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],

    displayDateFormat: 'LLLL',
    timezone: 'Asia/Hong_Kong',

    // total of items per page
    chatMesssagePerPage: 7,
};

const localhostSetting = {
    // cloudinaryFolder: 'mtgameresport_dev',

    dbHost: 'localhost',
    dbName: 'react_keystonejs',
    dbLogName: 'react_keystonejslog',
    dbAuthEnable: false,
    dbUser: '[dbusername]',
    dbPassword: '[dbpassword]',
    dbPort: 27017,

    appDomain: 'localhost:3026',
    newRelicName: '[projectname]localhost',
    enableHttp: true,
};

const developmentSetting = {
    // cloudinaryFolder: 'mtgameresport_dev',

    dbHost: 'localhost',
    dbName: 'react_keystonejs',
    dbLogName: 'react_keystonejslog',
    dbAuthEnable: false,
    dbUser: '[dbusername]',
    dbPassword: '[dbpassword]',
    dbPort: 27017,

    appDomain: 'localhost:3026',
    newRelicName: '[projectname]dev',
    enableHttp: true,
};

const betaSetting = {
    // cloudinaryFolder: 'mtgameresport_dev',

    dbHost: 'localhost',
    dbName: 'react_keystonejs',
    dbLogName: 'react_keystonejslog',
    dbAuthEnable: false,
    dbUser: '[dbusername]',
    dbPassword: '[dbpassword]',
    dbPort: 27017,

    newRelicName: '[projectname]beta',
    enableHttp: true
};

const productionSetting = {
    // cloudinaryFolder: 'mtgameresport_prod',

    // dbHost: 'mtgameresport-shard-00-00-w9lra.mongodb.net:27017,mtgameresport-shard-00-01-w9lra.mongodb.net:27017,mtgameresport-shard-00-02-w9lra.mongodb.net:27017',
    // dbName: 'mtgamer_esportsdb',
    // dbLogName: 'mtgamer_esportsdblog',
    dbAuthEnable: true,
    // dbUser: 'mtgesportdbadmin',
    // dbPassword: 'Od9ipPbJnrI3Ndyn',
    dbPort: 27017,
    dbOptions: '?replicaSet=MTGamerEsport-shard-0&ssl=true&authSource=admin',
    appDomain: 'esports.mtgamer.com',
    newRelicName: '[projectname]prod',
    enableHttp: true,
    port: 3000,
    adminPath: 'admin',
};

function Config() {
    this.appEnv = process.env.APP_ENV || AppEnv.localhost.key;
    this.clientPlatform = process.env.CLIENT_PLATFORM || ClientPlatform.web.key;
    this.keystoneMode = process.env.KEYSTONE_MODE || KeystoneMode.cms.key;
    this.stressTestMode = process.env.STRESSTESTMODE || null;

    _.extend(this, commonSetting);

    switch (this.appEnv) {
        case AppEnv.localhost.key:
            _.extend(this, localhostSetting);
            break;
        case AppEnv.development.key:
            _.extend(this, developmentSetting);
            break;
        case AppEnv.beta.key:
            _.extend(this, betaSetting);
            break;
        case AppEnv.production.key:
            _.extend(this, productionSetting);
            break;
        default:
            _.extend(this, localhostSetting);
    }

    if (this.keystoneMode === KeystoneMode.cms.key) {
        // this.port =  3001;
        this.newRelicName = `${this.newRelicName}_cms`;
    }
}

module.exports = Config;
