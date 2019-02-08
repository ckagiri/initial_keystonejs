const keystone = require('keystone');
const url = require('url');
const request = require('request');

const APIError = require(global.__base + '/routes/lib/APIError');
const Email = require(global.__base + '/routes/lib/Email');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const Config = require(global.__base + '/config/Config');
const conf = new Config();
const auth = require(global.__base + '/routes/lib/auth');

const register = function register(req, res) {
    console.log('req.body', req.body);
    let validateParams = new Promise((resolve, reject) => {
        const acceptedParameters = [
            'username',
            'email',
            'password',
            'confirmPassword',
            'recaptchaResponse',
            'luckyDraw',
        ];
        for (const key of Object.keys(req.body)) {
            if (!acceptedParameters.includes(key)) {
                reject(new Error('InvalidParameters'));
                return;
            }
        }
        resolve();
    });
    let validatePassword = new Promise((resolve, reject) => {
        if (req.body.password !== req.body.confirmPassword) {
            reject(new Error('密碼不相符'));
            return;
        }
        if (
            !new RegExp(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(req.body.password)
        ) {
            reject(new Error('密碼長度必須在6-16位以內'));
            return;
        }
        resolve();
    });

    let validateEmail = new Promise((resolve, reject) => {
        if (
            !req.body.email ||
            req.body.email === '' ||
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(req.body.email)
        ) {
            reject(new Error('電郵格式錯誤'));
            return;
        }
        resolve();
    });

    let validateRecpatcha = new Promise((resolve, reject) => {
        const postData = {
            secret: conf.recaptchaSecret,
            response: req.body.recaptchaResponse
        };
        request(
            {
                url: 'https://www.google.com/recaptcha/api/siteverify',
                // body: JSON.stringify(postData),
                form: postData,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            },
            (err, res, body) => {
                body = JSON.parse(body);
                if (err) {
                    reject(new Error('Error recaptcha'));
                } else if (!body.success) {
                    reject(new Error('Fail recaptcha'));
                } else {
                    resolve();
                }
            }
        );
    });

    const memberKeystoneList = keystone.list('Member');

    Promise.all([validateParams, validatePassword, validateEmail])
        .then(() => {
            const { body: { email } } = req;
            return memberKeystoneList.model
                .findOne({
                    email: new RegExp(`^${email.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i')
                })
                .exec();
        })
        .then(member => {
            if (member) {
                return Promise.reject(new APIError('帳戶已被使用'));
            } else {
                return memberKeystoneList.model.findOne({ username: req.body.username }).exec()
            }
        })
        .then(member => {
            if (member) {
                return Promise.reject(new APIError('用戶名稱已被使用'));
            } else {
                return Promise.resolve();
            }
        })
        .then(() => {
            validateRecpatcha;
        })
        .then(() => {
            const member = req.body;
            Object.assign(member, {nameChangeCounter: 1});
            delete member.confirmPassword;
            delete member.recaptchaResponse;
            const newDoc = memberKeystoneList.model(member);
            return newDoc.save();
        })
        .then(newMember => {
            if (newMember) {
                const activate_token = auth.generateToken({
                    memberId: newMember._id.toString(),
                    type: 'activation'
                });

                var urlObject = {
                    protocol: conf.enableHttp ? 'http:' : 'https:',
                    host: conf.appDomain + '/',
                    query: {
                        activate: activate_token,
                    },
                };
                if (req.body.luckyDraw) {
                    urlObject = { 
                        ...urlObject,
                        ...{
                            query: {
                                ...urlObject.query,
                                ...{
                                    draw: 1,
                                },
                            },
                        },
                    };
                }
                const activationUrl = url.format(urlObject);

                const mailOptions = {
                    subject: 'MTGamer tournament注冊成功', // Subject line
                    text: `歡迎使用MTGamer tournament 請點擊下列連結/按鍵，以確認您的電郵地址。

                    請勿回覆此電郵。`, // plain text body
                    html: `<p>閣下的MTGamer tournament 平台會員註冊已經完成。<br /> 請確認下列內容。<br /> <br /> <strong>關於註冊用電子信箱：</strong><br /> <br /> 登入用電子信箱：<a href="mailto:adamleehinip@gmail.com">${newMember.email}</a></p>
                    <p>平台帳號：${newMember.username}</p>
                    <p><br /> 使用MTGamer tournament 平台提供的服務時需要以此登入。<br /> <br /> 包含忘記密碼，我們會發送重設密碼等與帳戶相關的重要通知至該信箱，請確保此電子信箱可以正常收發信件。<br /> <br /> <strong>聯絡我們：</strong><br /> <br /> 有關於 MTGamer 平台 ID 相關的問題，請至下列網頁詢問。<br /> 請勿回覆本信件。</p>
                    <p><a style="background-color: #202020; border-top: 20px solid #202020; border-right: 40px solid #202020; border-bottom: 20px solid #202020; border-left: 40px solid #202020; border-radius: 3px; color: #fd3a3a; display: inline-block; font-family: 1Helvetica Neue\',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 600; letter-spacing: .3px; text-decoration: none;" href="${activationUrl}" target="_blank" rel="noopener">帳戶激活</a></p>` // html body
                };

                Email.sendMail(newMember, mailOptions);
                apiRequestHelper.sendPostRes(req, res, newMember, 202);
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('Unknown Error'));
            }
        })
        .catch(err => {
            if (err instanceof APIError) {
                switch (err.name) {
                    case '帳戶已被使用': {
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
                    case '用戶名稱已被使用': {
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
                apiRequestHelper.sendPostErrorRes(req, res, {
                    message: err.message
                });
            }
        });
};

module.exports = register;
