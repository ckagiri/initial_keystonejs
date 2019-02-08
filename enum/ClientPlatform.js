/*
 *  @project    Freeplay
 *  @file       KeystoneMode.js
 *  @author     Gem Ng/ 4 Play
 *  @date       20151124
 *
 *  @description
 *  Enum file for KeystoneMode
 */
const Enum = require('enum');

const ClientPlatform = new Enum(['ios', 'android', 'web']);

module.exports = ClientPlatform;
