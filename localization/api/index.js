'use strict';

var glob = require('glob');
var fs = require('fs');
var path = require('path');

const translations = glob
    .sync(global.__base + '/localization/api/locales/*.json')
    .map(function(filename) {
        return [
            path.basename(filename, '.json'),
            fs.readFileSync(filename, 'utf8')
        ];
    })
    .map(function(arg) {
        var locale = arg[0];
        var file = arg[1];
        return [locale, JSON.parse(file)];
    })
    .reduce(function(collection, arg) {
        var locale = arg[0];
        var messages = arg[1];
        collection[locale] = messages;
        return collection;
    }, {});

// console.log(translations['en-us']['home']['visitTitle']);

var getLocalizedObjectList = function() {
    return Object.keys(translations).map(key => translations[key]);
};

var getLocalizedObject = function(locale) {
    return translations[locale];
};

var getLocalizedText = function(locale, id) {
    var arrayOfStrings = id.split('.');
    arrayOfStrings.unshift(locale);

    return arrayOfStrings.reduce(function(value, key) {
        return value[key];
    }, translations);
};

// console.log(getText('en-us', 'home.visitTitle'));

module.exports = {
    getLocalizedObjectList,
    getLocalizedObject,
    getLocalizedText
};
