const jwt = require('jsonwebtoken');
const AuthConfig = require('../config/auth');
const Repositories = require('../repositories/index');


class AuthMiddlewares {//*É o middleware que verifica se exixte o CPF e faz o balanço da conta geral
    async userAuth (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) throw 'Token indefinido';
            const [, token] = authHeader.split(' ');
            const verifyToken = await jwt.verify(token, AuthConfig.secret);
            const verifyAccount = await Repositories.AccountRepository.findById({ id: verifyToken.account_id });
            if(!verifyAccount) throw 'Conta não existe';
            if(!verifyToken) throw 'Token inválido.';
            res.auth = { token: verifyToken };
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    }
};
module.exports = new AuthMiddlewares();