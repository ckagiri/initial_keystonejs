const _ = require('lodash');
const keystone = require('keystone');

const Types = keystone.Field.Types;

const Locale = require(`${global.__base}/enum/Locale`);

const localize = function localize(fields) {
    const defaultLocale = Locale['zh-HK'].key;

    const localizedFields = {
        locale: {
            type: Types.Select,
            options: Locale.options,
            default: defaultLocale
        }
    };

    Object.keys(fields).forEach(key => {
        localizedFields[key] = fields[key];
        if (
            [
                Types.Text.name,
                Types.Textarea.name,
                Types.CloudinaryImage.name,
                Types.Html.name
            ].includes(fields[key].type.name) &&
            !fields[key].skipLocalized
        ) {
            localizedFields[key].dependsOn = {
                locale: defaultLocale
            };

            Locale.enums
                .filter(locale => locale.key !== defaultLocale)
                .forEach(locale => {
                    const currentKey = `${key}_${locale.key}`;
                    localizedFields[currentKey] = _.clone(fields[key]);
                    localizedFields[currentKey].dependsOn = {
                        locale: locale.key
                    };
                    delete localizedFields[currentKey].required;
                });
        }
    });

    return localizedFields;
};

module.exports = localize;
