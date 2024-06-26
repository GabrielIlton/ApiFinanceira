const { StatementRepository } = require('../../repositories/index');
const { AccountRepository } = require('../../repositories/index');
const { StatementValidators } = require('../../validators/index');


class StatementService {
    async listOneAccountStatement ({ token }) {
        const statement = await StatementRepository.findByIdListStatements({ id: token.account_id });
        if(statement.length === 0) throw 'Você não tem nenhuma transação.';
        return statement;
    };

    async statementByDate ({ token, query }) {
        await StatementValidators.statementByDateValidator(query)
        const condition = {
            accountId: token.account_id,  created_at: {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate)
            }
        }; 
        const statement = await StatementRepository.findByDateStatements({ condition });
        if(statement.length === 0) throw "Não há nenhuma transação nesse período de tempo."
        return statement;
    };

    async listAllStatements ({ token }) {
        const account = await AccountRepository.findByAdmin({ id: token.account_id }); 
        if(!account) throw 'Você não tem acesso.'
        const statement = await StatementRepository.findAllStatements({});
        if(statement.length === 0) throw 'Não há de transações.';
        return statement;
    };
}

module.exports = new StatementService();