const keystone = require('keystone');

const EnhancedList = require(`${global.__base}/models/lib/EnhancedList`);
const Types = keystone.Field.Types;

// const authCodeEnhancedList = new EnhancedList('AuthCode', {
//     track: true,
//     map: { name: 'code' },
//     defaultColumns: 'member, phone, code'
// });

// authCodeEnhancedList.add({
//     member: { type: Types.Relationship, ref: 'Member', initial: true },
// 	phone: { type: Types.Text, initial: true },
// 	code: { type: Types.Text, initial: true },
// });

// authCodeEnhancedList.register();
// module.exports = authCodeEnhancedList;
