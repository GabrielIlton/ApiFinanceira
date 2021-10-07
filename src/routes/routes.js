const { Router } = require('express');//*Importa o express
const router = Router();//*Importa a function router
const AccountController = require('../controllers/AccountController');//*Importa os controllers
const StatementController = require('../controllers/StatementController');
const FinanceMiddlewares = require('../middlewares/FinanceMiddlewares');

//!SÃO TODAS AS ROTAS DA APLICATION

router.post("/account", AccountController.createAccount);

router.get("/statement", StatementController.listStatement);

router.post("/deposit/:cpf", FinanceMiddlewares.existeCpf, AccountController.depositAccount);

router.post("/withdraw/:cpf", FinanceMiddlewares.existeCpf, AccountController.withdrawAccount);

router.get("/statementByDate/", FinanceMiddlewares.existeCpf, StatementController.statementByDate);

router.put("/updatenameaccount/:cpf", FinanceMiddlewares.existeCpf, AccountController.updateName);

router.get("/accountsget", AccountController.getAccount);

router.get("/accountdetails/:cpf", FinanceMiddlewares.existeCpf, AccountController.getAccountDetails);

router.delete("/account/:cpf", FinanceMiddlewares.existeCpf, AccountController.deleteAccount);

router.post("/accountP2P", FinanceMiddlewares.existeCpf, AccountController.transactionAccount);

router.get("/accountsaldo/:cpf", FinanceMiddlewares.existeCpf, AccountController.getSaldo);


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