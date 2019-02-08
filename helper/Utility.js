/*
* Utility included some helper static function
*/

const keystone = require('keystone');
const mongoose = keystone.mongoose;
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
// Config
const Config = require(global.__base +
    '/config/Config.js');
const conf = new Config();

function Utility() {}

/**
* An enum object as argument and string as return value
* The enum need to have count defined
* */
Utility.enumToKeystonOptionStr = function enumToKeystonOptionStr(enumObj) {
    let returnOptionString = '';
    for (let i = 0; i < enumObj.enums.length; i += 1) {
        returnOptionString += enumObj.enums[i].key;

        if (i < enumObj.enums.length - 1) {
            returnOptionString += ',';
        }
    }
    return returnOptionString;
};

Utility.createPreSaveError = function createPreSaveError(msg) {
    const error = new ValidationError(this);
    error.errors.email = new ValidatorError(null, msg, null, null);
    return error;
};

Utility.createError = function createError(msg) {
    return new Error(msg);
};

Utility.isString = function isString(str) {
    return typeof str === 'string' || str instanceof String;
};

Utility.capitalize = function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

Utility.getClientIp = function getClientIp(req) {
    const str =
        (req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || '')
            .split(',')[0] || req.client.remoteAddress;
    const array = str.split(':');
    return array.slice(-1)[0];
};

Utility.getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Utility.formatDate = function formatDate(date, format, locale) {
    moment.locale(locale || 'zh-tw');
    return moment(date).tz(conf.timezone).format(conf.displayDateFormat)
};

Utility.putObjectIdAndNameToOptionArray = function putObjectIdAndNameToOptionArray(
    dataArray
) {
    const destArray = [];
    dataArray.forEach(item => {
        const tempObj = {};
        tempObj.displayValue = item.name;
        tempObj.value = item._id;
        destArray.push(tempObj);
    });
    return destArray;
};

Utility.putEnumToOptionArray = function putEnumToOptionArray(enumObj) {
    const destArray = [];
    for (let i = 0; i < enumObj.enums.length; i += 1) {
        const tempObj = {};
        tempObj.displayValue = enumObj.enums[i].key;
        tempObj.value = enumObj.enums[i].key;
        destArray.push(tempObj);
    }
    return destArray;
};

Utility.checkWhetherKeyInEnum = function checkWhetherKeyInEnum(enumObj, key) {
    for (let i = 0; i < enumObj.enums.length; i += 1) {
        if (key === enumObj.get(i).key) {
            return true;
        }
    }
    return false;
};

Utility.getDirectories = function getDirectories(srcpath) {
    return fs
        .readdirSync(srcpath)
        .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
};

module.exports = Utility;
