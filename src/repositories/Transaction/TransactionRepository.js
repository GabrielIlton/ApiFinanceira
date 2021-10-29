const TransactionModel = require('../../models/transaction');

class TransactionRepository {
    async P2Pcashout ({ accountSend, amount }) {
        return await TransactionModel.create({ 
            type: 'cashout',
            amount: amount,
            accountId: accountSend._id
        });
    }

    async P2Pcashin ({ accountReciever, amount }) {
        return await TransactionModel.create({
            type: 'cashin',
            amount: amount,
            accountId: accountReciever._id
        });
    }
}

module.exports = new TransactionRepository();