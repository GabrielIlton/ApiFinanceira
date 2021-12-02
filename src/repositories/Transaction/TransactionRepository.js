const { TransactionModel } = require('../../models/index');

class TransactionRepository {
    async P2Pcashout ({ accountSend, amount }) {
        return await TransactionModel.create({ 
            type: 'cashout',
            amount: amount,
            accountId: accountSend._id
        });
    };

    async P2Pcashin ({ accountReciever, amount }) {
        return await TransactionModel.create({
            type: 'cashin',
            amount: amount,
            accountId: accountReciever._id
        });
    };
    async P2PcashoutSecurity ({ accountSend, amount }) {
        return await TransactionModel.create({ 
            type: 'cashoutSecurity',
            amount: amount,
            accountId: accountSend._id
        });
    };

    async P2PcashinSecurity ({ accountReciever, amount }) {
        return await TransactionModel.create({
            type: 'cashinSecurity',
            amount: amount,
            accountId: accountReciever._id
        });
    };

    async findByDateTransactions ({ condition }) {
        const transaction = await TransactionModel.find(condition)
        return transaction;
    };
}

module.exports = new TransactionRepository();