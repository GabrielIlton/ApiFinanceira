const AccountModel = require('../models/account');
const bcrypt = require('bcryptjs');
const AccountRepository = require('../repositories/Account/AccountRepository');


class AuthMiddlewares {
    async userLogin (req, res, next) {
        try {
            const login = req.body;
            const account = await AccountRepository.findByDocumentEmail({ email: login.email });
            if(!account) throw 'Conta não existe.';
            const passwordCorrect = await bcrypt.compare(login.password, account.password);
            if(!passwordCorrect) throw 'Senha incorreta.';
            res.login = { account };
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    }
};

module.exports = new AuthMiddlewares();