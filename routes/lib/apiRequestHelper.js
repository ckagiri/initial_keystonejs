const RequestHelper = require(`${global.__base}/routes/lib/RequestHelper`);

class APIRequestHelper extends RequestHelper {
    constructor(options) {
        if (!APIRequestHelper.instance) {
            super(options);
            APIRequestHelper.instance = this;
        }

        return APIRequestHelper.instance;
    }
}

const apiRequestHelper = new APIRequestHelper();

module.exports = apiRequestHelper;
