const keystone = require('keystone');
const moment = require('moment');
const APIError = require(global.__base + '/routes/lib/APIError');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const veriflySmsAuthCode = function veriflySmsAuthCode(req, res) {
    new Promise((resolve, reject) => {
        const phone = req.body.phone;
        const code = req.body.code;
        if (!phone) {
            reject(new Error('請輸入電話號碼'));
            return;
        }
        if (!code) {
            reject(new Error('請輸入驗證碼'));
            return;
        }
        resolve({phone, code});
    })
    .then(e => {
        return new Promise((resolve, reject) => {
            const { phone, code } = e;
            const authCodeKeystoneList = keystone.list('AuthCode');
            return authCodeKeystoneList.model.findOne({
                phone: phone,
            })
            .sort({ createdAt: -1 })
            .exec()
            .then((authCode)=>{
                if(!authCode){
                    reject(new Error('無效驗證碼'))
                }
                if(code === authCode.code){
                    if(parseInt(moment().diff(moment(authCode.createdAt), 'seconds')) > 180){
                        reject(new Error('驗證碼超時'))
                    }else{
                        resolve(authCode);
                    }
                }else{
                    reject(new Error('驗證碼錯誤'));
                }
            })
        })
    })
    .then((authCode) => {
        return new Promise((resolve, reject) => {
            const memberKeystoneList = keystone.list('Member');
                return memberKeystoneList.model.findOne({
                    _id: authCode.member
                })
                .exec()
                .then((member) => {
                    if(!!member){
                        resolve({member, authCode})
                    }else{
                        reject(new Error('Invalid Member'))
                    }
                })
            })
    })
    .then(e => {
        const { member, authCode} = e;
        member.phone = authCode.phone;
        return member.save();
    })
    .then(() => {
        apiRequestHelper.sendPostRes(req, res, {});
        return Promise.resolve();
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

module.exports = veriflySmsAuthCode;
