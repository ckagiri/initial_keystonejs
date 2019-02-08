// import path from 'path-browserify';
import moment from 'moment';

export const getPropertyFromObjectPath = (object, path) => {
    // // console.log("michaeltest: util -- getPropertyFromObjectPath -- path = " + path);
    try {
        if (Object.keys(object).length > 0) {
            let paths = path.split('.');
            return paths.reduce((value, key) => value[key], object);
        }
    } catch (e) {
        if (process.env.NODE_ENV) {
            // console.log(e);
        }
        return '';
    }
    return '';
};

export const formatLocaleString = (localeString, isNormalized = false) => {
    let result = localeString;
    if (isNormalized) {
        result = result.replace('-', '_');
    } else {
        result = result.replace('_', '-');
    }

    return result;
};

export const compareLocale = (left, right) => {
    return formatLocaleString(left) === formatLocaleString(right);
};

export const fromNow = (time, level=0, startTime = moment()) => {
    const timeUnit = [
        'years', 'months', 'weeks', 'days', 'hours', 'minutes'
    ];
    var timeFromNow = parseInt(moment(time).diff(startTime, timeUnit[level]));
    if(timeFromNow >=1){
        let remain;
        switch(level){
            case 0:{
                remain = parseInt(moment(time).diff(startTime, timeUnit[level+1])%12)
                break;
            }
            case 1:{
                remain = parseInt(moment(time).diff(startTime, timeUnit[level+1])%4)
                break;
            }
            case 2:{
                remain = parseInt(moment(time).diff(startTime, timeUnit[level+1])%7)
                break;
            }
            case 3:{
                remain = parseInt(moment(time).diff(startTime, timeUnit[level+1])%24)
                break;
            }
            case 4:{
                remain = parseInt(moment(time).diff(startTime, timeUnit[level+1])%60)
                break;
            }
            case 5:{
                remain = '';
                break;
            }
            case 6:{
                timeFromNow = 0;
                remain = '';
                break;
            }
            default:{
                break;
            }
        }
        return {
            time:timeFromNow,
            unit : timeUnit[level] ? timeUnit[level] : 'minutes' ,
            remain: !!remain ? remain : '',
            remainUnit: !!remain && timeUnit[level+1] ? timeUnit[level+1] : ''
        }
    }else{
        if(level<6){
            return fromNow(time, level+1, startTime);
        }else{
            return {
                time: 0,
                unit: 'minutes',
                remain: '',
                remainUnit: ''
            }
        }
    }
}
