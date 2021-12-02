const AccountValidators = require('./AccountValidators/Account');
const StatementValidators = require('./StatementValidators/Statement');
const ImageValidators = require('./ImageValidators/Image');


const Validators = {
    AccountValidators,
    StatementValidators,
    ImageValidators
};

module.exports = Validators;