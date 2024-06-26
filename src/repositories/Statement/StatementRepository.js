const { StatementModel } = require('../../models/index');

class StatementRepository {
    async depositCreateStatement ({ deposit, token }) {
        const depositStatement = await StatementModel.create({
            type: 'deposit',
            amount: deposit,
            accountId: token.account_id
        });
        return depositStatement;
    };

    async withDrawCreateStatement ({ withDraw, token }) {
        const withDrawStatement = await StatementModel.create({
            type: 'withDraw',
            amount: withDraw,
            accountId: token.account_id
        });
        return withDrawStatement;
    };

    async withDrawCreateStatementSecurity ({ withDraw, token }) {
        const withDrawStatement = await StatementModel.create({
            type: 'withDrawSecurity',
            amount: withDraw,
            accountId: token.account_id
        });
        return withDrawStatement;
    };

    async P2PcashoutCreate ({ amount, accountSend }) {
        return await StatementModel.create({
            type:'cashoutP2P',
            amount: amount,    
            accountId: accountSend._id
        });
    };

    async P2PcashinCreate ({ amount, accountReciever }) {
        return await StatementModel.create({ 
            type:'cashinP2P',
            amount: amount, 
            accountId: accountReciever._id
        });
    };
    async P2PcashoutSecurity ({ amount, accountSend }) {
        return await StatementModel.create({
            type:'cashoutP2PSecurity',
            amount: amount,    
            accountId: accountSend._id
        });
    };

    async P2PcashinSecurity ({ amount, accountReciever }) {
        return await StatementModel.create({ 
            type:'cashinP2PSecurity',
            amount: amount, 
            accountId: accountReciever._id
        });
    };

    async findByIdListStatements ({ id }) {
        return await StatementModel.find({ accountId: id });
    };

    async findByDateStatements ({ condition }) {
        const statement = await StatementModel.find(condition)
        return statement;
    };

    async findAllStatements ({}) {
        return await StatementModel.find({})
    };
}

module.exports = new StatementRepository();