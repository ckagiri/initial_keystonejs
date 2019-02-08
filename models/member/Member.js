/*
 *  @project    MTgamer_esports
 *  @file       AppEnv.js
 *  @author     WingChan
 *  @date       20170808
 *
 *  @description
 *  Model file for GameMember
 */
const Joi = require('joi');
const keystone = require('keystone');

const EnhancedList = require(`${global.__base}/models/lib/EnhancedList`);
const Types = keystone.Field.Types;
// const memberEnhancedList = new EnhancedList('Member', {
//     track: true,
//     map: { name: 'username' },
//     defaultColumns:
//         'username, realname, email, status, country, city, region, dateOfBirth, gameAccount'
// });

// memberEnhancedList.add({
//     // displayName: { type: Types.Text, hidden: true, noedit: true },
//     email: { type: Types.Email },
//     password: { type: Types.Password },
//     profilePic: { type: Types.Relationship, ref: 'ProfilePicture' },
//     backgroundPic: { type: Types.Relationship, ref: 'BackgroundPicture' },
//     defaultProfilePic: { type: Types.Relationship, ref: 'ProfilePicturePool' },
//     defaultBackgroundPic: { type: Types.Relationship, ref: 'ProfilePicturePool' },
//     username: { type: Types.Text },
//     realname: { type: Types.Text },
//     phone: { type: Types.Text},
//     idNumber: { type: Types.Text },
//     // gender: { type: Types.Select, options: Gender.options, initial: true },
//     country: { type: Types.Relationship, ref: 'Country' },
//     city: { type: Types.Relationship, ref: 'City' },
//     region: { type: Types.Relationship, ref: 'Region' },
//     dateOfBirth: { type: Types.Date },
//     facebookId: { type: Types.Text, default: null },
//     facebookToken: { type: Types.Text },
//     twitchId: { type: Types.Text, default: null },
//     smsLimit: { type: Types.Number, default: 0 },
//     nameChangeCounter: { type: Types.Number, default: 0 },
//     description: { type: Types.Textarea, height: '200px', default: '' },
//     bankName: { type: Types.Text, default: '' },
//     bankAccount: { type: Types.Text, default: '' },
//     bankHolderName: { type: Types.Text, default: '' },
//     status: {
//         type: Types.Select,
//         options: MemberStatus.options,
//         default: MemberStatus.notActivated.key
//     },
//     gameAccount: {
//         type: Types.List,
//         fields: {
//             game: { type: Types.Relationship, ref: 'Game' },
//             server: { type: Types.Relationship, ref: 'Server' },
//             gameUsername: { type: Types.Text }
//         }
//     },
//     luckyDraw: {
//         type: Types.Text,
//     }
// });

// memberEnhancedList.defaultSelectOption = '_id profilePic backgroundPic username country city region createdAt description status';
// memberEnhancedList.defaultRejectOption = '-password';

// memberEnhancedList.defaultPatchJoiSchema = {
//     path: Joi.alternatives().try([
//         Joi.string().valid('/username'),
//         Joi.string().valid('/realname'),
//         Joi.string().valid('/phone'),
//         Joi.string().valid('/idNumber'),
//         Joi.string().valid('/description'),
//         Joi.string().valid('/country'),
//         Joi.string().valid('/city'),
//         Joi.string().valid('/region'),
//         Joi.string().valid('/dateOfBirth'),
//         Joi.string().valid('/profilePic'),
//         Joi.string().valid('/backgroundPic'),
//         Joi.string().valid('/bankAccount'),
//         Joi.string().valid('/bankName'),
//         Joi.string().valid('/bankHolderName'),
//     ])
// };

// const profilePictureEnhancedList = require(global.__base +
//     '/models/member/ProfilePicture');
// memberEnhancedList.addChildResource({
//     enhancedList: profilePictureEnhancedList,
//     ref: 'member',
//     genGet: true
// });

// const backgroundEnhancedList = require(global.__base +
//     '/models/member/BackgroundPicture');
// memberEnhancedList.addChildResource({
//     enhancedList: backgroundEnhancedList,
//     ref: 'member',
//     genGet: true
// });

// // memberEnhancedList.keystoneList.schema.pre('init', (next, d) => {
// //     var { email } = d;
// //     if (email) {
// //         email = `(${email})`;
// //     }
// //     if (d.realname) {
// //         d.displayName = `${d.username} | ${d.realname} ${email}`;
// //     } else {
// //         d.displayName = `${d.username} ${email}`;
// //     }
// //     next();
// // });

// memberEnhancedList.register();

// module.exports = memberEnhancedList;
