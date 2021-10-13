const AccountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const AuthConfig = require('../config/auth');

class AuthMiddlewares {//*É o middleware que verifica se exixte o CPF e faz o balanço da conta geral
    async userAuth (req, res, next) {//?Verifica se exixte o CPF, e no next determina se a function continua ou não
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) throw 'Token indefinido';
            const [, token] = authHeader.split(' ');
            const verifyToken = await jwt.verify(token, AuthConfig.secret);
            const verifyAccount = AccountModel.findOne({ id: verifyToken.account_id, deleted: false });
            if(!verifyAccount) throw 'Conta não existe';
            if(!verifyToken) throw 'Token inválido.';
            res.auth = { id: verifyToken };

            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    }
};
//!MIDDLEWARE
module.exports = new AuthMiddlewares();