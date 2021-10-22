const AccountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const AuthConfig = require('../config/auth');
const bcrypt = require('bcryptjs');//*Importa o bcryptjs

class AuthMiddlewares {//*É o middleware que verifica se exixte o CPF e faz o balanço da conta geral
    async userLogin (req, res, next) {//?Verifica se exixte o CPF, e no next determina se a function continua ou não
        try {
            const login = req.body;
            const account = await AccountModel.findOne({ email: login.email, deleted: false });
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
//!MIDDLEWARE
module.exports = new AuthMiddlewares();