const { Router } = require('express');
const router = Router();
const AccountController = require('../controllers/AccountController');
const StatementController = require('../controllers/StatementController');
const Image = require('../controllers/ImageController');
const Auth = require('../middlewares/Auth');
const Login = require('../middlewares/Login');
const multer = require('multer');
const multerConfig = require('../config/multer');

//!SÃO TODAS AS ROTAS DA APLICAÇÃO
      
router.post("/create", AccountController.createAccount);

router.post("/login", Login.userLogin, AccountController.loginAccount);

router.get("/details", Auth.userAuth, AccountController.getAccountDetails);

router.get("/balance", Auth.userAuth, AccountController.getSaldo);

router.get("/accounts/list", Auth.userAuth, AccountController.getAccounts);

router.put("/password", Auth.userAuth, AccountController.updatePasswordAccount);

router.post("/image", Auth.userAuth, multer(multerConfig).single('file'), Image.uploadImage);

router.delete("/image", Auth.userAuth, Image.deleteImage);

router.delete("/delete", Auth.userAuth, AccountController.deleteAccount);

router.put("/retrieve", AccountController.retrieveAccount);

router.get("/statement", Auth.userAuth, StatementController.listOneAccountStatement);

router.get("/statementByDate", Auth.userAuth, StatementController.statementByDate);

router.get("/statement/list", Auth.userAuth, StatementController.listAllStatement);

router.post("/deposit", Auth.userAuth, AccountController.depositAccount);

router.post("/withdraw", Auth.userAuth, AccountController.withdrawAccount);

router.post("/p2p", Auth.userAuth, AccountController.p2p);

module.exports = router;

/** Tipos de parametros
 * 
 * Route Params => Identificar um recurso editar/deletar/buscar
 * Query Params => Paginação / Filtro
 * Body Params => Os objetos inserção/alteração (JSON)
 */