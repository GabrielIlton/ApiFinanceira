require('dotenv').config();

const auth ={
    secret: process.env.TOKEN_SECRET,
    expires: process.env.TOKEN_EXPIRES
};

module.exports = auth;