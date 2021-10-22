const { Router } = require('express');//*Importa o express
const router = Router();//*Importa a function router
const AccountController = require('../controllers/AccountController');//*Importa os controllers
const StatementController = require('../controllers/StatementController');
const Auth = require('../middlewares/Auth');
const Login = require('../middlewares/Login');
const multer = require('multer');
const multerConfig = require('../config/multer');
// const FinanceMiddlewares = require('../middlewares/FinanceMiddlewares');
// const authConfig = require('../config/auth.json');
// const bcrypt = require('bcryptjs');

//!SÃO TODAS AS ROTAS DA APLICATION
      
router.post("/create", AccountController.createAccount);

router.post("/login", Login.userLogin, AccountController.loginAccount);

router.get("/details", Auth.userAuth, AccountController.getAccountDetails);

router.get("/balance", Auth.userAuth, AccountController.getSaldo);

router.get("/accounts/list", Auth.userAuth, AccountController.getAccounts);

router.put("/password", Auth.userAuth, AccountController.updatePasswordAccount);

router.post("/image", Auth.userAuth, multer(multerConfig).single('file'), AccountController.uploadImage);//!Fazer funcionar

router.delete("/delete", Auth.userAuth, AccountController.deleteAccount);

router.put("/retrieve", AccountController.retrieveAccount);

router.get("/statement", Auth.userAuth, StatementController.listOneAccountStatement);

router.get("/statementByDate", Auth.userAuth, StatementController.statementByDate);

router.get("/statement/list", Auth.userAuth, StatementController.listAllStatement);

router.post("/deposit", Auth.userAuth, AccountController.depositAccount);

router.post("/withdraw", Auth.userAuth, AccountController.withdrawAccount);

router.post("/P2P", Auth.userAuth, AccountController.P2P);

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