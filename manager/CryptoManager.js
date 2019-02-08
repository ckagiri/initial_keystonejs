/**
 * This file defines the CryptoManager for encryption and decrytion of message.
 *
 *  Seed is hashed using SHA256 and SHA512 to produce IV and key
 *  Message is then encrypt and descrypted using AES256 algorithm
 *
 *  Dependency: crypto-js     //run npm install crypto-js --save
 */

const CryptoJS = require('crypto-js');

function CryptoManager() {}

function getLeadingZeros(str, size) {
    let retStr = '';
    for (let i = 0; i < size; i += 1) {
        retStr += '0';
    }
    return (retStr + str).substr(-size);
}

CryptoManager.encryptDataStr = function encryptDataStr(rawDataStr, seed) {
    const keySha = CryptoJS.SHA256(seed.toString());
    const ivSha = CryptoJS.SHA512(seed.toString());

    const keyHex = CryptoJS.enc.Utf8.parse(getLeadingZeros(keySha, 32));
    const ivHex = CryptoJS.enc.Utf8.parse(getLeadingZeros(ivSha, 16));

    const encrypted = CryptoJS.AES.encrypt(rawDataStr, keyHex, { iv: ivHex });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

CryptoManager.decryptDataStr = function decryptDataStr(encryptedDataStr, seed) {
    const keySha = CryptoJS.SHA256(seed.toString());
    const ivSha = CryptoJS.SHA512(seed.toString());

    const keyUtf8 = CryptoJS.enc.Utf8.parse(getLeadingZeros(keySha, 32));
    const ivUtf8 = CryptoJS.enc.Utf8.parse(getLeadingZeros(ivSha, 16));

    const decrypted = CryptoJS.AES.decrypt(encryptedDataStr, keyUtf8, {
        iv: ivUtf8
    });
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedStr;
};

module.exports = CryptoManager;
