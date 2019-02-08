var Config = require(global.__base + '/config/Config');
var conf = new Config();
var client = require('twilio')(conf.twilioSID, conf.twilioAuthToken);

var sendSms = function (target, msg) {

	client.messages.create({
		to: target,
		from: conf.twilioOwnNum,
		body: msg,
	}, function (err, message) {
		if (err) {
			console.log(JSON.stringify(err));
		}
		// console.log('SMS sent: ', message);
	});
	console.log(target, msg);
};

module.exports = {
    sendSms
};
