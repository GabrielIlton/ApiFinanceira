const bcrypt = require('bcryptjs');
const Repositories = require('../repositories/index');


class AuthMiddlewares {
    async userLogin (req, res, next) {
        try {
            const login = req.body;
            const account = await Repositories.AccountRepository.findByDocumentEmail({ email: login.email });
            if(!account) throw 'Conta não existe.';
            const passwordCorrect = await bcrypt.compare(login.password, account.password);
            const passwordSecurityCorrect = await bcrypt.compare(login.password, account.passwordSecurity);
            if(!passwordCorrect && !passwordSecurityCorrect) throw 'Senha incorreta.';
            if(passwordCorrect) {
                account.passwordSecurity = undefined;
            } else {
                account.password = undefined;
                
                const dateNow = new Date().getTime() - (60 * 24 * 60000); 

                const conditionSecurity = {
                    type: ['withDrawSecurity', 'cashoutP2PSecurity'], accountId: account.id,  created_at: {
                        $gte: new Date(dateNow),
                        $lte: new Date()
                    }
                };

                const statementSecurity = await Repositories.StatementRepository.findByDateStatements({ condition: conditionSecurity });

                if(statementSecurity.length == 0){
                    if(account.balance >= 1){
                        const balanceSecurity = (account.balance / 100) * 20;
                        await Repositories.AccountRepository.updateBalanceSecurity({ id: account._id, balanceSecurity });
                    };
                };
            };
            res.login = { account };
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    };
};

module.exports = new AuthMiddlewares();