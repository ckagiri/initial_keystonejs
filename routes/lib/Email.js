const nodemailer = require('nodemailer');
var Config = require(global.__base + '/config/Config');
var conf = new Config();

// create reusable transporter object using the default SMTP transport
const smtpConfig = {
    host: conf.smtpHost,
    port: 587,
    secure: false,
    auth: {
        user: conf.smtpUsername,
        pass: conf.smtpPassword
    }
};
var transporter = nodemailer.createTransport(`smtps://${conf.smtpUsername}:${conf.smtpPassword}@${conf.smtpHost}/?pool=true`, smtpConfig);

const defaultMailOptions = {
    from: 'noreply@mtgamer.com'
};

const sendMail = function sendMail(member, mailOptions) {
    transporter.sendMail(
        Object.assign(
            {},
            defaultMailOptions,
            { to: member.email },
            mailOptions
        ),
        (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
    );
};

module.exports = {
    sendMail
};
