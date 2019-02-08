const authHeader = require('auth-header');

const auth = require(global.__base + '/routes/lib/auth');
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');

const authenticate = function authenticate(type = 'login') {
    return (req, res, next) => {
        new Promise((resolve, reject) => {
            if (!req.get('authorization')) {
                reject(new Error('Authorization required'));
                return;
            }
            resolve();
        })
            .then(() => {
                const authorization = authHeader.parse(
                    req.get('authorization')
                );
                if (authorization.scheme !== 'Bearer') {
                    return Promise.reject(
                        new Error('Please use Bearer scheme')
                    );
                } else {
                    return Promise.resolve(authorization);
                }
            })
            .then(authorization => {
                const payload = auth.validateToken(authorization.token);
                if (
                    payload.type === type &&
                    payload.memberId === req.params.memberId
                ) {
                    return auth.getValidMember({
                        _id: payload.memberId
                    });
                } else {
                    return Promise.reject(new Error('Invalid token'));
                }
            })
            .then(member => {
                if (member) {
                    //req.member = member;
                    next();
                } else {
                    return Promise.reject(new Error('Invalid member'));
                }
            })
            .catch(err => {
                // res.set('WWW-Authenticate', authHeader.format('Bearer', undefined, {
                //     realm: 'Access to member records'
                // }));
                res.set('Access-Control-Allow-Origin', '*');
                apiRequestHelper.sendPostErrorRes(
                    req,
                    res,
                    {
                        message: err.message
                    },
                    401
                );
            });
    };
};

module.exports = authenticate;
