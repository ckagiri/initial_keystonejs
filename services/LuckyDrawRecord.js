const keystone = require('keystone');

class LuckyDrawRecord {
    constructor() {
        this.createRecord();
    }

    async createRecord() {
        console.log('create a record on LuckyDraw collection');
        const luckyDrawModel = keystone.list('LuckyDraw');
        const findOne = await luckyDrawModel.model.find({}).exec();
        if (findOne.length == 0) {
            const createLuckyDrawRecord = await luckyDrawModel.model({
                open: false
            });
            createLuckyDrawRecord.save();
        }
    }
}

module.exports = LuckyDrawRecord;
