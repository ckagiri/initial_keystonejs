const keystone = require('keystone');
const url = require('url');

const APIError = require(global.__base + '/routes/lib/APIError');
const Email = require(global.__base + '/routes/lib/Email');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const Config = require(global.__base + '/config/Config');
const conf = new Config();
const auth = require(global.__base + '/routes/lib/auth');

const sendActivationEmail = function sendActivationEmail(req, res) {
    new Promise((resolve, reject) => {
        if (
            !req.body.email ||
            req.body.email === '' ||
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(req.body.email)
        ) {
            reject(new APIError('InvalidEmailFormat'));
            return;
        }
        resolve();
    })
        .then(() => {
            const memberKeystoneList = keystone.list('Member');
            return memberKeystoneList.model
                .findOne({
                    email: req.body.email
                })
                .lean()
                .exec();
        })
        .then(member => {
            if (member) {
                const activate_token = auth.generateToken({
                    memberId: member._id.toString(),
                    type: 'activation'
                });

                const urlObject = {
                    protocol: conf.enableHttp ? 'http:' : 'https:',
                    host: conf.appDomain
                };
                const activationUrl = url.format(
                    Object.assign({}, urlObject, {
                        query: {
                            activate: activate_token
                        }
                    })
                );

                const mailOptions = {
                    subject: 'MTGamer tournament帳戶激活', // Subject line
                    text: `Click ${activationUrl} to activate.`, // plain text body
                    html: `<p>MTGamer tournament帳戶激活&nbsp;</p>
                    <p>歡迎使用MTGamer tournament 請點擊下列連結/按鍵，以確認您的電郵地址。</p>
                    <p>&nbsp;</p>
                    <p>請勿回覆此電郵。</p>
                    <p><a style="background-color: #202020; border-top: 20px solid #202020; border-right: 40px solid #202020; border-bottom: 20px solid #202020; border-left: 40px solid #202020; border-radius: 3px; color: #fd3a3a; display: inline-block; font-family: 1Helvetica Neue\',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 600; letter-spacing: .3px; text-decoration: none;" href="${activationUrl}" target="_blank" rel="noopener">帳戶激活</a></p>` // html body
                };

                Email.sendMail(member, mailOptions);
                apiRequestHelper.sendPostRes(req, res, member, 204);
                return Promise.resolve();
            } else {
                return Promise.reject(new APIError('Invalid Member'));
            }
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

module.exports = sendActivationEmail;
