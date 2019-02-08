const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const rpn = require('request-promise-native');

const MemberStatus = require(global.__base + '/enum/MemberStatus');
const Gender = require(global.__base + '/enum/Gender');

const generateToken = function generateToken(payload) {
    const token = jwt.sign(payload, keystone.get('cookie secret'), {
        expiresIn: '7d'
    });

    return token;
};

const validateToken = function validateToken(token) {
    return jwt.verify(token, keystone.get('cookie secret'));
};

const getValidMember = function getValidMember(memberInfo = {}) {
    let condition = {};
    if (memberInfo._id) {
        condition._id = memberInfo._id;
        console.log('test1: ', condition._id);
        console.log('test2: ', memberInfo._id);
    } else if (memberInfo.email) {
        condition.email = {
            $regex: new RegExp(memberInfo.email.toLowerCase(), 'i'),
        };
    } else if (memberInfo.facebookId) {
        condition.facebookId = memberInfo.facebookId;
    }

    if (Object.keys(condition).length === 0) {
        return Promise.reject(new Error('Invalid parameters'));
    } else {
        const memberKeystoneList = keystone.list('Member');
        return memberKeystoneList.model.findOne(condition).exec();
    }
};

const getValidMemberForFacebook = function getValidMemberForFacebook(
    facebookData,
    facebookToken,
    createMember = true
) {
    return getValidMember({
        facebookId: facebookData.data.user_id
    })
        .then(member => {
            if (member) {
                return Promise.resolve(member);
            } else {
                return rpn({
                    uri: `https://graph.facebook.com/${facebookData.data
                        .user_id}`,
                    qs: {
                        access_token: facebookToken,
                        fields: 'name,email,age_range,birthday,gender'
                    },
                    json: true
                })
                // .then(async response => {
                //     const memberKeystoneList = keystone.list('Member');
                //     const checkEmail = await memberKeystoneList.model.findOne({ email: response.email }).exec();
                //     if (checkEmail) {
                //         // return Promise.reject(new Error('Email already exists'))
                //         return Promise.reject(new Error('帳戶已被使用'))
                //     }
                //     return Promise.resolve(response);
                // })
                // .then(async response => {
                //     const memberKeystoneList = keystone.list('Member');
                //     const checkUsername = await memberKeystoneList.model.findOne({ username: response.name }).exec();
                //     if (checkUsername) {
                //         Object.assign(response, {genUsername: true});
                //         return Promise.resolve(response);
                //     }
                //     Object.assign(response, {genUsername: false});
                //     return Promise.resolve(response);
                // })
                .then(async (response) => {
                    if (response && !response.error) {
                        const memberKeystoneList = keystone.list('Member');

                        let gender = null;
                        const genderEnumItem = Gender.enums.find(
                            item =>
                                response.gender &&
                                item.key.toUpperCase() ===
                                    response.gender.toUpperCase()
                        );
                        if (genderEnumItem) {
                            gender = genderEnumItem.key;
                        }

                        // console.log(response.genUsername);
                        // const username = response.genUsername ? response.email : response.name;
                        const checkEmail = await memberKeystoneList.model.findOne({ email: response.email }).exec();
                        if (checkEmail) {
                            const update = await memberKeystoneList.model.findOneAndUpdate({ email: response.email }, { facebookId: response.id }).exec();
                            return update;
                        } else {
                            const newDoc = memberKeystoneList.model({
                                username: response.name,
                                email: response.email,
                                facebookId: response.id,
                                nameChangeCounter: 0,
                                status: MemberStatus.activated.key,
                                gender: gender
                            });
                            return newDoc.save();
                        }
                    } else {
                        return Promise.reject(
                            new Error(response.error.message)
                        );
                    }
                });
            }
        })
        .catch(err => {
            return Promise.reject(new Error(err.message));
        });
};

module.exports = {
    generateToken,
    validateToken,
    getValidMember,
    getValidMemberForFacebook
};
