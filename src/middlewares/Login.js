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
            };
            res.login = { account };
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    };
};

module.exports = new AuthMiddlewares();