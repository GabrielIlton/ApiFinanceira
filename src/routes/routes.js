const { Router } = require('express');//*Importa o express
const router = Router();//*Importa a function router
const AccountController = require('../controllers/AccountController');//*Importa os controllers
const StatementController = require('../controllers/StatementController');
const Auth = require('../middlewares/Auth')
// const FinanceMiddlewares = require('../middlewares/FinanceMiddlewares');
// const authConfig = require('../config/auth.json');
// const bcrypt = require('bcryptjs');

//!SÃO TODAS AS ROTAS DA APLICATION

/**
 * @swagger
 * /account:
 *  post:
 *      description: Create account 
 *      responses:
 *          '200':
 *          description: Sucessfull response
 */          
router.post("/account", AccountController.createAccount);

router.put("/retrieveaccount", AccountController.retrieveAccount);

router.get("/statementall", StatementController.listAllStatement);

router.get("/statementone", Auth.userAuth, StatementController.listOneAccountStatement);

router.post("/deposit", Auth.userAuth, AccountController.depositAccount);

router.post("/withdraw", Auth.userAuth, AccountController.withdrawAccount);

router.get("/statementByDate/", Auth.userAuth, StatementController.statementByDate);

router.put("/updateaccount", Auth.userAuth, AccountController.updatePasswordAccount);

router.get("/accountsget", AccountController.getAccounts);

router.get("/accountdetails", Auth.userAuth, AccountController.getAccountDetails);

router.delete("/deleteAccount", Auth.userAuth, AccountController.deleteAccount);

router.post("/accountP2P", Auth.userAuth, AccountController.transactionAccounts);

router.get("/accountsaldo", Auth.userAuth, AccountController.getSaldo);

router.post("/loginaccount", AccountController.loginAccount);


// //Deve conter envio de algum documento referente a pessoa;
// //Deve conter registro de contas (vinculada a uma única pessoa);
// //Uma pessoa pode ter apenas um conta;
//todo O sistema deve conter uma Autenticação por JWT (Será feito o login pela conta);
// //Deve conter uma listagem de contas;
// //Deve conter um EndPoint de detalhes da conta
// //Cada conta deve ter um saldo único;
// // Deve conter um EndPoint de P2P;
// // Deve conter um EndPoint de vizualização de saldo da conta;

module.exports = router;//*Exporta as rotas

/**
 * cpf - string
 * name - string
 * id - uuid
 // statement []
 */

/** Tipos de parametros
 * 
 * Route Params => Identificar um recurso editar/deletar/buscar
 * Query Params => Paginação / Filtro
 * Body Params => Os objetos inserção/alteração (JSON)
 */