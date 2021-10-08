const AccountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const AuthConfig = require('../config/auth');

class AuthMiddlewares {//*É o middleware que verifica se exixte o CPF e faz o balanço da conta geral
    async userAuth (req, res, next) {//?Verifica se exixte o CPF, e no next determina se a function continua ou não
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) throw 'Token indefinido';

            const [, token] = authHeader.split(' ');
            // const parts = authHeader.split(' ');
            // if(!parts.lenght === 2) throw 'Token malformated';
            // const [ scheme, token ] = parts;
            // if(!/^Bearer$/i.test(scheme)) throw 'Token invalido';
            // const verifyId = await jwt.verify(token, authConfig.secret) {
            //     if (err) return res.status(401);
            //     req.accountId = decoded.id
            //     // next(); 
            // }); 

            const verifyToken = await jwt.verify(token, AuthConfig.secret);
            res.auth = verifyToken;
            next();
        } catch (error) {
            return res.status(400).json({error})
        } 
    }
};

//!MIDDLEWARE
module.exports = new AuthMiddlewares();