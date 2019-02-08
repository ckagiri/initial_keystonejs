/*
 *  @project    PokerHero
 *  @file       AppEnv.js
 *  @author     Gem Ng/ 4 Play
 *  @date       201504013
 *
 *  @description
 *  Enum file for Server App Env
 */
const Enum = require('enum');

const AppEnv = new Enum([
    'localhost',
    'development',
    'beta',
    'beta_close',
    'production'
]);

module.exports = AppEnv;
