const fieldTypes = FIELD_TYPES;
const types = Object.keys(fieldTypes);

const Columns = {};
types.forEach(type => {
    if (typeof fieldTypes[type] !== 'string') return;
    Columns[type] = require(`keystone/fields/types/${type}/${fieldTypes[
        type
    ]}Column`);
});
Columns.id = require('keystone/fields/components/columns/IdColumn');

const Fields = {};
types.forEach(type => {
    if (typeof fieldTypes[type] !== 'string') return;
    Fields[type] = require(`keystone/fields/types/${type}/${fieldTypes[
        type
    ]}Field`);
});

const Filters = {};
types.forEach(type => {
    if (typeof fieldTypes[type] !== 'string') return;
    Filters[type] = require(`keystone/fields/types/${type}/${fieldTypes[
        type
    ]}Filter`);
});

exports.Columns = Columns;
exports.Fields = Fields;
exports.Filters = Filters;
