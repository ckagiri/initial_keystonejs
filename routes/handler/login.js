const rpn = require('request-promise-native');

const Config = require(global.__base + '/config/Config');
const conf = new Config();
const auth = require(global.__base + '/routes/lib/auth');
const APIError = require(global.__base + '/routes/lib/APIError');
const MemberStatus = require(global.__base + '/enum/MemberStatus');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const login = function login(req, res) {
    // console.log('>>>>>>>', req.body);
    if (req.body.facebookId && req.body.facebookToken) {
        rpn({
            uri: 'https://graph.facebook.com/debug_token',
            qs: {
                input_token: req.body.facebookToken,
                access_token: `${conf.facebookAppId}|${conf.facebookAppSecret}`
            },
            json: true
        })
            .then(facebookData => {
                if (facebookData.data.is_valid) {
                    return auth.getValidMemberForFacebook(
                        facebookData,
                        req.body.facebookToken
                    );
                } else {
                    return Promise.reject(
                        new Error(facebookData.data.error.message)
                    );
                }
            })
            .then(member => {
                const payload = {
                    memberId: member._id,
                    type: 'login'
                };

                const data = {
                    access_token: auth.generateToken(payload)
                };

                return Promise.resolve(data);
            })
            .then(result => {
                apiRequestHelper.sendPostRes(req, res, result);
            })
            .catch(err => {
                apiRequestHelper.sendPostToCreateErrorRes(req, res, {
                    message: err.message
                });
            });
    } else if (req.body.email && req.body.password) {
        auth
            .getValidMember({
                email: req.body.email,
                facebookId: null
            })
            .then(member => {
                if (!member) {
                    return Promise.reject(new Error('電郵或密碼錯誤'));
                } else {
                    return new Promise((resolve, reject) => {
                        member._.password.compare(
                            req.body.password,
                            (err, result) => {
                                if (result) {
                                    resolve(member);
                                } else {
                                    reject(new Error('電郵或密碼錯誤'));
                                }
                            }
                        );
                    });
                }
            })
            .then(member => {
                if (member.status !== MemberStatus.activated.key) {
                    return Promise.reject(new APIError('帳戶未認證'));
                } else {
                    const payload = {
                        memberId: member._id,
                        type: 'login'
                    };

                    const data = {
                        access_token: auth.generateToken(payload)
                    };

                    return Promise.resolve(data);
                }
            })
            .then(result => {
                apiRequestHelper.sendPostRes(req, res, result);
            })
            .catch(err => {
                if (err instanceof APIError) {
                    switch (err.name) {
                        case '帳戶未認證': {
                            apiRequestHelper.sendPostErrorRes(
                                req,
                                res,
                                {
                                    name: err.name,
                                    message: err.message
                                },
                                403
                            );
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                } else {
                    apiRequestHelper.sendPostToCreateErrorRes(req, res, {
                        message: err.message
                    });
                }
            });
    } else {
        apiRequestHelper.sendPostErrorRes(req, res, null);
    }
};

module.exports = login;
