const bodyParser = require('body-parser');
const multer = require('multer');

const bindBodyParser = function bindBodyParser(app) {
    app.use(bodyParser.json({}));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer({ includeEmptyFields: true }));
};

exports = bindBodyParser;
module.exports = bindBodyParser;
