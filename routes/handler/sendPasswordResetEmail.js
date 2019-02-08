const keystone = require('keystone');
const url = require('url');
const generatePassword = require('password-generator');
const request = require('request');

const APIError = require(global.__base + '/routes/lib/APIError');
const Email = require(global.__base + '/routes/lib/Email');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');
const Config = require(global.__base + '/config/Config');
const conf = new Config();

const sendPasswordResetEmail = function sendPasswordResetEmail(req, res) {

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

    const e = {};

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
                .exec();
        })
        .then(member => {
            if (member) {
                const newPassword = generatePassword(12, false);
                member.password = newPassword;
                return member.save().then(member => ({
                    member: member,
                    newPassword: newPassword
                }));
            } else {
                return Promise.reject(new APIError('不是有效的用戶'));
            }
        })
        .then((memberWithPassword) => {
            e.memberWithPassword = memberWithPassword;
            validateRecpatcha;
        })
        .then( ()=> {
            const { memberWithPassword } = e;
            console.log('memberWithPassword2',memberWithPassword);
            const urlObject = {
                protocol: conf.enableHttp ? 'http:' : 'https:',
                host: conf.appDomain
            };
            const homeUrl = url.format(urlObject);

            const mailOptions = {
                subject: '密碼重設', // Subject line
                text: `密碼重設`, // plain text body
                html: `<p>密碼重設</p>
                <p>閣下的密碼已重設為: ${memberWithPassword.newPassword}</p>
                <p><br /> <strong>聯絡我們：</strong><br /> <br /> 有關於 MTGamer tournament 平台 ID 相關的問題，請至下列網頁詢問。<br /> 請勿回覆本信件。</p>` // html body
            };

            Email.sendMail(memberWithPassword.member, mailOptions);
            apiRequestHelper.sendPostRes(req, res, {}, 204);
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

module.exports = sendPasswordResetEmail;
