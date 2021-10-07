const AccountModel = require('../models/account')

class FinanceMiddlewares {//*É o middleware que verifica se exixte o CPF e faz o balanço da conta geral
    async existeCpf (req, res, next) {//?Verifica se exixte o CPF, e no next determina se a function continua ou não

        try {
            const { cpf } = req.params;
            const account = await AccountModel.findOne({ cpf, delete: false });
            if(!account) throw 'Autenticação é obrigatória';
            res.accountId = account._id;
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    }
};

//!MIDDLEWARE
module.exports = new FinanceMiddlewares();