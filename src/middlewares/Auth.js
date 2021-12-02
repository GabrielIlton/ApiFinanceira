const jwt = require('jsonwebtoken');
const AuthConfig = require('../config/auth');


class AuthMiddlewares {
    async userAuth (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) throw 'Token indefinido.';
            const [, token] = authHeader.split(' ');
            const verifyToken = await jwt.verify(token, AuthConfig.secret);
            if(!verifyToken) throw 'Token inválido.';
            res.auth = { token: verifyToken };
            
            next();
        } catch (error) {
            return res.status(400).json({ error })
        } 
    }
};
module.exports = new AuthMiddlewares();