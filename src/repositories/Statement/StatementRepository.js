const StatementModel = require('../../models/statement');

class StatementRepository {
    async depositStatement ({ deposit, token }) {
        const depositStatement = await StatementModel.create({
            type: 'deposit',
            amount: deposit,
            accountId: token.account_id
        });
        return depositStatement;
    }

    async withDrawStatement ({ withDraw, token }) {
        const withDrawStatement = await StatementModel.create({
            type: 'withDraw',
            amount: withDraw,
            accountId: token.account_id
        });
        return withDrawStatement;
    }

    async P2Pcashout ({ amount, accountSend }) {
        return await StatementModel.create({
            type:'cashoutP2P',
            amount: amount,    
            accountId: accountSend._id
        });
    }

    async P2Pcashin ({ amount, accountReciever }) {
        return await StatementModel.create({ 
            type:'cashinP2P',
            amount: amount, 
            accountId: accountReciever._id
        });
    }

}

module.exports = new StatementRepository();