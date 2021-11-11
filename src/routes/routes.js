const { Router } = require('express');
const router = Router();
const Controllers = require('../controllers/index');
const Middlewares = require('../middlewares/index');
const multer = require('multer');
const Config = require('../config/index');


//!SÃO TODAS AS ROTAS DA APLICAÇÃO
router.post("/create", Controllers.AccountController.createAccount);

router.post("/login", Middlewares.Login.userLogin, Controllers.AccountController.loginAccount);

router.get("/details", Middlewares.Auth.userAuth, Controllers.AccountController.getAccountDetails);

router.get("/balance", Middlewares.Auth.userAuth, Controllers.AccountController.getSaldo);

router.get("/accounts/list", Middlewares.Auth.userAuth, Controllers.AccountController.getAccounts);

router.post("/passwordsecurity", Middlewares.Auth.userAuth, Controllers.AccountController.createPasswordSecurity);

router.put("/password", Middlewares.Auth.userAuth, Controllers.AccountController.updatePasswordAccount);

router.post("/image", Middlewares.Auth.userAuth, multer(Config.multerConfig).single('file'), Controllers.ImageController.uploadImage);

router.delete("/image", Middlewares.Auth.userAuth, Controllers.ImageController.deleteImage);

router.delete("/delete", Middlewares.Auth.userAuth, Controllers.AccountController.deleteAccount);

router.put("/retrieve", Controllers.AccountController.retrieveAccount);

router.get("/statement", Middlewares.Auth.userAuth, Controllers.StatementController.listOneAccountStatement);

router.get("/statementByDate", Middlewares.Auth.userAuth, Controllers.StatementController.statementByDate);

router.get("/statement/list", Middlewares.Auth.userAuth, Controllers.StatementController.listAllStatement);

router.post("/deposit", Middlewares.Auth.userAuth, Controllers.AccountController.depositAccount);

router.post("/withdraw", Middlewares.Auth.userAuth, Controllers.AccountController.withdrawAccount);

router.post("/p2p", Middlewares.Auth.userAuth, Controllers.AccountController.p2p);

router.post("/callbackp2p", Controllers.AccountController.callbackp2p);

module.exports = router;