const request = require('request');
const Config = require(global.__base + '/config/Config');
const config = new Config();

exports.ChallongeRequestHelper = function(resource, entity, method = 'POST') {
    return new Promise((resolve, reject) => {
        entity['api_key'] = config.challongeApiKey;
        console.log('entity');
        console.log(entity);
        let options = {};
        if (method === 'POST' || method === 'PUT') {
            options = {
                uri: `${config.challongeRequestUrl}/${resource}.json?include_participants=1&include_matches=1`,
                body: JSON.stringify(entity),
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            options = {
                uri: `${config.challongeRequestUrl}/${resource}.json?include_participants=1&api_key=${config.challongeApiKey}&state=all`,
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
        request(options, (err, res, body) => {
            if (err) {
                console.log('res Error: ' + err);
                reject(new Error(err));
            } else if (res.statusCode !== 200) {
                console.log('status != 200');
                reject(new Error(body));
            } else {
                const data = JSON.parse(body);
                resolve(data);
            }
        });
    });
};
