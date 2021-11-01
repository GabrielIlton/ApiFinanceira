const StatementService = require('../services/Statement/StatementService');


class StatementController { 
    async listOneAccountStatement (req, res) {
        try {
            const { token } = res.auth;
            const accountStatement = await StatementService.listOneAccountStatement({ token });
            const finalReturn = accountStatement.map(account => ({ 
                amount: account.amount,
                type: account.type,
                created_at: account.created_at
            }));
            return res.status(200).json({ accountStatement: finalReturn });
        } catch (error) {
            return res.status(404).json({ message: error });
        };
    };
    
    async statementByDate (req, res) {     
        try {
            const { token } = res.auth;
       
            const statements = await StatementService.statementByDate({ token, query: req.query });
            
            const finalReturn = statements.map(account => ({ 
                amount: account.amount,
                type: account.type,
                created_at: account.created_at
            }));

            return res.status(200).json({ finalReturn });
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };
    
    async listAllStatement (req, res) {
        try {
            const { token } = res.auth;
           
            const statements = await StatementService.listAllStatements({ token });
            const finalReturn = statements.map(account => ({ 
                accountId: account.accountId,
                amount: account.amount,
                type: account.type,
                created_at: account.created_at
            }));

            return res.status(200).json({ finalReturn });
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };
}

module.exports = new StatementController();//?Exporta o statement controller