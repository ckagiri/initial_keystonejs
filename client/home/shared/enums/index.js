import Enum from 'enum';

export const tournamentStatus = {
    pending: '報名階段',
    checking_in: '報到階段',
    checked_in: '等待開始',
    underway: '比賽進行中',
    awaiting_review: '等待結算',
    complete: '比賽完成'
};

export const timeUnit = {
    minutes: '分鐘',
    hours: '小時',
    days: '日',
    weeks: '星期',
    months: '月',
    years: '年'
};
