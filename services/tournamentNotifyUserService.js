'use strict';

const keystone = require('keystone');
const schedule = require('node-schedule');
const moment = require('moment');
const Sms = require(global.__base + '/routes/lib/Sms');

// const Config = require(global.__base + '/config/Config');
// const conf = new Config();

const tournamentNotifyUserService = function tournamentNotifyUserService() {
    schedule.scheduleJob(
        '0 */30 * * * *', ManualNotify
    );
    ManualNotify();
    schedule.scheduleJob(
		'0 */2 * * * *', AutoNotify
        // runOnInit: true,
        // timeZone: conf.timezone,
    );
    // job.start();
}

const ManualNotify = function(){
    const start = moment();
    const second = moment(start).get('second');
    if(second > 0 && second <= 59){
        start.subtract(second, 'second')
    }
    const end = moment(start).add(30, 'm');
    console.log(`Excuting service to notify user from period from ${start} to ${end}.`);
    const tournamentList = keystone.list('Tournament');
    tournamentList.model
        .find({
            notifyParticipants: true,
            notify_time: { $gt: new Date(`${start}`)},
            notify_time: { $lt: new Date(`${end}`) } 
        })
        .exec()
            .then((tournaments) => { 
                return Promise.all(tournaments.map((tournament) => {
                    SendSms(tournament, false)
                    tournament.notifyParticipants = false;
                    tournament.save();
                }));
            })
            .then((results) => (
                null
                //console.log(`Manual touramentNotifyUserSerivce run successfully at ${start}.`)
            ))
            .catch((err) => {
                //console.log(`Manual tournamentNotifyUserService serivce failed at ${start}: `);
                console.log(err);
    });
}

const AutoNotify = function(){
    const start = moment();
    const second = moment(start).get('second');
    if(second > 0 && second <= 59){
        start.subtract(second, 'second')
    }
    const end = moment(start).add(30, 'm');
    console.log(`Excuting service to auto notify user from period from ${start} to ${end}.`);
    const tournamentList2 = keystone.list('Tournament');
    tournamentList2.model
        .find({
            isSent: false,
            start_at: { $lt: new Date(`${end}`) } 
        })
        .populate('rule')
        .exec()
            .then((tournaments) => { 
                return Promise.all(tournaments.map((tournament) => {
                    SendSms(tournament, true)
                    tournament.isSent = true;
                    tournament.save();
                }));
            })
            .then((results) => {
                //console.log(`Auto tournamentNotifyUserService serivce run successfully at ${start}.`)
            })
            .catch((err) => {
                //console.log(`Auto tournamentNotifyUserService serivce failed at ${start}: `);
                console.log(err);
    });
}

const SendSms = (tournament, defaultMsg = true) => {
    console.log('tournament名: ', tournament.name);
    Promise.all(
        tournament.participants.map(participantId =>(
            keystone.list('Member').model
                .findById( participantId.toString())
                .lean()
                .exec()
                .then(member => {
                    if(!member){
                        return Promise.reject();
                    }
                    return member;
                })
                .then((member) => {
                    const { rule } = tournament;
                    const msg = defaultMsg? (rule ? rule.name : '')+' 準備開始。':tournament.messageSendToParticipants;
                    //Sms.sendSms(member.phone, msg)
                    console.log(msg);
                    return Promise.resolve()
                })
        ))
    )
}

module.exports = tournamentNotifyUserService;
