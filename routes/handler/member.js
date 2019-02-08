const keystone = require('keystone');
const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
// helpers
const apiRequestHelper = require(global.__base +
    '/routes/lib/apiRequestHelper');
const memberEnhancedList = require(global.__base +
    '/models/member/Member');
const member = {};

member.updateMemberInfo = async (req, res) => {
    try {
        const { memberId } = req.params;
        const memberKeystoneList = keystone.list('Member');
        var currentMember = await memberKeystoneList.model.findOne({
            _id: memberId,
        }).exec();

        const { idNumber, phone, realname, username, country } = req.body;
        /*
        ** for update directly, if set value before
        */
        var editUsername = false;
        if (currentMember) {
            const {
                idNumber: oldIdNumber,
                phone: oldPhone,
                realname: oldRealName,
                username: oldUsername,
                nameChangeCounter: oldCounter,
            } = currentMember;
            if (idNumber && oldIdNumber && idNumber !== oldIdNumber) {
                throw new Error('身份證不允許更更改');
            } else if (phone && oldPhone && phone !== oldPhone) {
                throw new Error('電話號碼不允許更更改');
            } else if (!phone) {
                throw new Error('請先驗證您的電話號碼');
            } else if (realname && oldRealName && realname !== oldRealName) {
                throw new Error('您的真實名稱不允許更改');
            } else if (!country) {
                throw new Error('請填寫賽區');
            } else if (!realname) {
                throw new Error('請填寫真實名稱');
            } else if (username !== oldUsername && username) {
                if (oldCounter > 0) {
                    throw new Error('您的用戶名稱不允許更改多於一次');
                } else {
                    editUsername = true;
                }
            }
        }
        if (username) {
            const existingUsername = await memberKeystoneList.model.count({
                _id: {
                    $ne: memberId,
                },
                username,
            }).exec();
            if (existingUsername) {
                throw new Error('用戶名稱已被使用，請重新填寫。');
            }
        }

        // update
        const fields = [
            "username",
            "realname",
            "phone",
            "idNumber",
            "dateOfBirth",
            "country",
            "city",
            "region",
            "description",
            "bankName",
            "bankHolderName",
            "bankAccount",
            "profilePic",
            "backgroundPic",
            "defaultProfilePic",
            "defaultBackgroundPic",
        ];

        _.forEach(fields, (field) => {
            if (req.body[field]) {
                currentMember[field] = req.body[field];
            }
        });
        // console.log('>>>>>>>>>>>', req.body);
        /*
        ** update default picture and banner
        */
        var { updateDefaultPic, updateDefaultBanner, profilePic, backgroundPic, defaultProfilePic } = req.body;
        // console.log('>>>>>>>>>>', updateDefaultPic, currentMember.profilePic);
        if (updateDefaultPic && updateDefaultPic === 'true') {
            const { profilePic: oldProfilePic } = currentMember;
            currentMember.defaultProfilePic = oldProfilePic;
            currentMember.profilePic = null;
            // console.log('>>>>>>>>>>', updateDefaultPic, currentMember);
        } else if (profilePic) {
            currentMember.defaultProfilePic = null;
        }
        if (updateDefaultBanner && updateDefaultBanner === 'true') {
            const { backgroundPic } = currentMember;
            currentMember.defaultBackgroundPic = backgroundPic;
            currentMember.backgroundPic = null;
        } else if (backgroundPic) {
            currentMember.defaultBackgroundPic = null;
        }

        if (currentMember.nameChangeCounter <= 0 && editUsername) {
            currentMember.nameChangeCounter = 1;
        }
        // console.log(">>>>>>>>>>> ", req.body, currentMember);
        await currentMember.save();

        delete currentMember.password;
        delete currentMember.email;
        // const memberKeystoneList = keystone.list('Member');
        apiRequestHelper.sendPostRes(
            req,
            res,
            currentMember,
            200,
        );
    } catch (err) {
        console.log(err);
        apiRequestHelper.sendPostErrorRes(req, res, {
            message: err.message
        });
    }
}

member.getMemberInfo = async (req, res) => {
    try {
        const {
            params: {
                memberId,
            },
            query: search,
        } = req;
        const query = JSON.parse(JSON.stringify(search));
        const {
            populate
        } = query;
        var {
            select
        } = query;
        delete query.populate;
        delete query.select;

        var member = await memberEnhancedList
            .getById(
                memberId,
                query,
                populate,
                select
            )
            .lean()
            .exec();
        // keep it secret
        if (member && member.idNumber) {
            const { idNumber, idNumber: { length } } = member;
            member = {
                ...member,
                ...{
                    idNumber: idNumber.substr(0, Math.floor(length / 2)) + '*'.repeat(Math.round(length / 2)),
                },
            };
        }
        console.log(member);
        // set preview banner picture
        if (member.defaultBackgroundPic && !member.backgroundPic) {
            member = {
                ...member,
                ...{
                    backgroundPic: member.defaultBackgroundPic,
                },
            };
        }
        // set preview profile picture
        if (member.defaultProfilePic && !member.profilePic) {
            member = {
                ...member,
                ...{
                    profilePic: member.defaultProfilePic,
                },
            };
        }

        apiRequestHelper.sendPostRes(
            req,
            res,
            member,
            200
        );
    } catch (err) {
        apiRequestHelper.sendPostErrorRes(req, res, {
            message: err.message
        });
    }
}

module.exports = member;
