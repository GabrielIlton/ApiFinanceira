const { Router } = require('express');//*Importa o express
const router = Router();//*Importa a function router
const AccountController = require('../controllers/AccountController');//*Importa os controllers
const StatementController = require('../controllers/StatementController');
const Auth = require('../middlewares/Auth')
// const FinanceMiddlewares = require('../middlewares/FinanceMiddlewares');
// const authConfig = require('../config/auth.json');
// const bcrypt = require('bcryptjs');

//!SÃO TODAS AS ROTAS DA APLICATION
      
router.post("/createaccount", AccountController.createAccount);

router.put("/retrieveaccount", AccountController.retrieveAccount);

router.get("/statementall", StatementController.listAllStatement);

router.get("/statementone", Auth.userAuth, StatementController.listOneAccountStatement);

router.post("/deposit", Auth.userAuth, AccountController.depositAccount);

router.post("/withdraw", Auth.userAuth, AccountController.withdrawAccount);

router.get("/statementByDate", Auth.userAuth, StatementController.statementByDate);

router.put("/updatepasswordaccount", Auth.userAuth, AccountController.updatePasswordAccount);

router.get("/accountsget", AccountController.getAccounts);

router.get("/accountdetails", Auth.userAuth, AccountController.getAccountDetails);

router.delete("/deleteAccount", Auth.userAuth, AccountController.deleteAccount);

router.post("/accountP2P", Auth.userAuth, AccountController.P2P);

router.get("/accountsaldo", Auth.userAuth, AccountController.getSaldo);

router.post("/loginaccount", AccountController.loginAccount);

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