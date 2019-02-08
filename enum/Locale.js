const Enum = require('enum');

const Utility = require(`${global.__base}/helper/Utility`);

const Locale = new Enum({
    'zh-HK': 0,
    'zh-CN': 1,
    'en-US': 2
});

Locale.options = Utility.enumToKeystonOptionStr(Locale);

module.exports = Locale;
