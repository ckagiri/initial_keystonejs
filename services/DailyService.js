/*
** remove all of chat messages which are over 1 months
** Terry Chan 19/08/2018
*/
const keystone = require('keystone');
const cloudinary = require('cloudinary');
const _ = require('lodash');
const schedule = require('node-schedule');
const moment = require('moment');

// const Config = require(global.__base + '/config/Config');
// const conf = new Config();

cloudinary.config(keystone.get('cloudinary config'));

class DailyService{
    constructor() {
        schedule.scheduleJob('0 0 * * * *', () => {
            this.run();
        });
    }

    run() {
        this.runChatMessageClean();
        this.runSMSAskCounterClean();
    }

    async runChatMessageClean() {
        const oneMonthAgo = moment().subtract(1, 'months').startOf('day');
        console.log(`[Start ChatMessageClean]: The Minimum Date: ${oneMonthAgo.format('LLLL')}.`);
        var conditions = {
            updatedAt: {
                $lt: oneMonthAgo.toDate(),
            },
            read: true,
        };
        const selection = {
            _id: 1,
            image: 1,
        };
        try {
            const list = keystone.list('ChatMessage');
            // const pipelines = [
            //     {
            //         $match: conditions,
            //     },
            //     {
            //         $project: selection,
            //     },
                // {
                //     $unwind: {
                //         path: '$image',
                //         preserveNullAndEmptyArrays: true,
                //     }
                // },
                // {
                //     $project: {
                //         _id: 1,
                //         image: {
                //             $cond: [
                //                 { $ne: ['$image.1', null] },
                //                 '$image.public_id',
                //                 '',
                //             ],
                //         },
                //     },
                // },
            // ];
            // var expiredMessage = await list.model.aggregate(pipelines).exec();
            var expiredMessage = await list.model.find(conditions, selection).exec();
            const expiredMessageIds = [];
            const expiredMessageImages = [];
            const linearIdsWithImages = [];
            // console.log(expiredMessage);
            if (expiredMessage.length) {
                // perform unwind in application level for Dev mongodb version 2.4.X
                // can be removed when using up to 3.4 version
                _.forEach(expiredMessage, function(m) {
                    const id = m['_id'];
                    if (m.image && m.image.length) {
                        _.forEach(m.image, (e) => {
                            linearIdsWithImages.push({
                                '_id': id,
                                image: e.public_id,
                            });
                        });
                    } else {
                        linearIdsWithImages.push({
                            '_id': id,
                            image: '',
                        })
                    }
                });
                // console.log(linearIdsWithImages);
                await Promise.all(linearIdsWithImages.map(async (i) => {
                    if (i.image) {
                        const cImage = await cloudinary.uploader.destroy(i.image);
                        expiredMessageImages.push(i.image);
                    }
                    expiredMessageIds.push(i['_id']);
                }));
                console.log(`[Removing ChatMessageClean]: Total ${expiredMessageImages.length} Cloudinary Image(s).`);
                console.log(`[Removing ChatMessageClean]: Removed Image Public Id(s) [${expiredMessageImages.join(', ')}].`);
            }
            conditions = {
                _id: {
                    $in: expiredMessageIds,
                },
            };
            expiredMessage = await list.model.find(conditions).remove().exec();
            if (expiredMessage) {
                console.log(`[Removing ChatMessageClean]: Total ${expiredMessage.result.n} Message(s).`);
                console.log('Finished ChatMessageClean');
            }
        } catch (err) {
            console.log(`[Failed ChatMessageService]: ${err.message}`);
        }
    }

    async runSMSAskCounterClean() {
        const oneMonthAgo = moment().subtract(1, 'months').startOf('day');
        console.log(`Start Sms Ask Counter Reset Service`);
        try {
            const memberModel = keystone.list('Member');
            var resetSmsLimit = await memberModel.model.updateMany({}, {$set: { smsLimit: 0 }}).exec();
            console.log('Finish Ask Counter Reset Service', resetSmsLimit)
        } catch (err) {
            console.log(`Failed Ask Counter Reset Service: ${err.message}`);
        }
    }
    // startService() {
    //     this.job.start();
    // }

}

module.exports = DailyService;
