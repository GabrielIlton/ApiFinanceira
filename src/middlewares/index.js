const Auth = require('./Auth');
const Login = require('./Login');
const VerifyImage = require('./VerifyImage');

const Middlewares = {
    Auth,
    Login,
    VerifyImage
};

module.exports = Middlewares;