// const AccountModel = require('../models/account');
// const authConfig = require('../config/auth.json');

// class GenerateTokenMiddlewares {
//     async generateToken (req, res, next) {

//         try {
//             const { cpf } = req.params;
//             const account = await AccountModel.findOne({ cpf, delete: false });
//             const token = jwt.sign({ id: account._id }, authConfig.secret, { expiresIn: 86400, } );
//             next();
//         } catch (error) {
//             return res.status(400).json({error})
//         } 
//     }
// };
// //!MIDDLEWARE
// module.exports = new GenerateTokenMiddlewares();