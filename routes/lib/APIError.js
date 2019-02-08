const error_messages = {
    InvalidParameters: 'Invalid parameters',
    ConfirmPasswordNotMatch: 'Confirm password does not match',
    InvalidEmailFormat: 'Invalid format of email address',
    MemberAlreadyExists: 'Member already exists',
    MemberNotActivated: 'Member is not yet activated',
    WrongPassword: 'Wrong password'
};

class APIError extends Error {
    constructor(name) {
        const message = error_messages[name] ? error_messages[name] : name;
        super(message);
        this.name = name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

module.exports = APIError;
