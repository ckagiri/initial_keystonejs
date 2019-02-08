const keystone = require('keystone');
const mongoose = require('mongoose');
const url = require('url');

const APIError = require(global.__base + '/routes/lib/APIError');
const Sms = require(global.__base + '/routes/lib/Sms');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const Config = require(global.__base + '/config/Config');
const conf = new Config();
const auth = require(global.__base + '/routes/lib/auth');

const sendSmsAuthCode = function sendSmsAuthCode(req, res) {
    new Promise((resolve, reject) => {
        const phone = req.body.phone;
        const memberId = req.body.memberId;
        if (!req.body.phone) {
            reject(new APIError('請輸入電話號碼'));
            return;
        }
        if (!req.body.memberId) {
            reject(new APIError('請輸入memberId'));
            return;
        }
        resolve({phone, memberId});
    })
    .then(e => {
        const { phone, memberId } = e;
	    const code = getRandomInt(100000, 999999);
        const authCodeKeystoneList = keystone.list('AuthCode');
        let authCode = {
            member: memberId,
            phone: phone,
            code: code
        }
        const newDoc = authCodeKeystoneList.model(authCode);
        newDoc.save();
        return Promise.resolve(newDoc);
    })
    .then(async(newDoc) => {
        const msg = `eSports code ${newDoc.code}`;
        const memberModel = keystone.list('Member');
        const get = await memberModel.model.findOne({ _id: newDoc.member }).exec();
        if (get.smsLimit < 3) {
            const set = await memberModel.model.findOneAndUpdate({ _id: newDoc.member }, { smsLimit: ++get.smsLimit  }, { new: true }).exec();
            Sms.sendSms(newDoc.phone, msg);
            apiRequestHelper.sendPostRes(req, res, newDoc);
            return Promise.resolve();
        }
        apiRequestHelper.sendPostErrorRes(req, res, {
            message: 'Error'
        })
    })
    .catch(err => {
        if (err instanceof APIError) {
            apiRequestHelper.sendPostErrorRes(req, res, {
                name: err.name,
                message: err.message
            });
        } else {
            apiRequestHelper.sendPostErrorRes(req, res, {
                message: err.message
            });
        }
    });
};

const getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = sendSmsAuthCode;
