const AccountRepository = require('./Account/AccountRepository');
const ImageRepository = require('./Image/ImageRepository');
const StatementRepository = require('./Statement/StatementRepository');
const TransactionRepository = require('./Transaction/TransactionRepository');


const Repositories = {
    AccountRepository,
    ImageRepository,
    StatementRepository,
    TransactionRepository
};

module.exports = Repositories;