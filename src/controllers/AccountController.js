const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const StatementModel = require('../models/statement');//*Importa a collection statement
const TransactionModel = require('../models/transaction');//*Importa a collection transaction
const AccountService = require('../services/Account/AccountService');
const AccountValidator = require('../validators/AccountValidators/Account');
const AccountModel = require('../models/account');//*Importa a collection de models


class AccountController {//*É uma classe que tem todas a funcion de account
    async createAccount(req, res) {//*Create account 
        try {            
            const accountCreated = await AccountService.createAccount({ body: req.body })
        
            return res.status(201).json({ nome: accountCreated.name, email: accountCreated.email });
       }catch(error){
           return res.status(422).json({ error });    
       };
    };

    async loginAccount(req, res){//*Login account created
        try {
            const { account } = res.login;
            const token = await AccountService.loginAccount({ account });
            
            return res.status(200).json({ name: account.name, token });
    
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async getAccountDetails (req, res) {//*Find one account
        try {            
            const { token } = res.auth;
            const account = await AccountService.getAccountDetails({ token })
            account.password = undefined;
            account.deleted = undefined;
            return res.status(200).json({ account });
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

    async getSaldo (req, res) {//*Find balance account
        try {
            const { token } = res.auth;
            const account = await AccountService.getSaldo({ token });
            return res.status(200).json({ Nome: account.name, Balance: account.balance });
          
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };

    async getAccounts (req, res) {//*Find all accounts
        try {   
            const { token } = res.auth;
            const accounts = await AccountService.getAccounts({ token });
            accounts.password = undefined;
            return res.status(200).json({ accounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };
    
    async updatePasswordAccount (req,res) {//*Put o password
        try {            
            const { token } = res.auth;

            const account = await AccountService.updatePasswordAccount({ body: req.body, token })
            return res.status(200).json({name: account.name, message: "Senha alterada com sucesso."});//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async deleteAccount (req, res) {//*Delete account
        try {   
            const { token } = res.auth;
            const account = await AccountService.deleteAccount({ body: req.body, token })

            return res.status(200).json({deleted: account.name, message: 'Deletado com sucesso.'});
        } catch (error) {
            return res.status(400).json({error});
        }
    };

    async retrieveAccount(req, res){//*Retrieve a conta caso esteja excluida 
        try {           
            const account = await AccountService.retrieveAccount({ body: req.body });
            return res.status(200).json({ name: account.name, message: 'Sua conta foi recuperada com sucesso.' });
        } catch (error) {
            return res.status(400).json({error})
        };
    };

    async depositAccount (req, res) { //*Deposit in account  
        try {   
            const { token } = res.auth;            
            const account = await AccountService.depositAccount({ body: req.body, token })
            
            return res.status(201).json({ name: account.name, saldo: account.balance });
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {//*WithDraw in account 
        try {
            const { token } = res.auth;            
            const account = await AccountService.withDrawAccount({ body: req.body, token })
            return res.status(201).json({ nome: account.name, saque: req.body.withDraw, saldo: account.balance });
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async P2P (req, res) {//*P2P
        try {
            const { token } = res.auth;
            
            return account = await AccountService.P2P({ body: req.body, token });//!CONSERTAR O RETORNO
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };
}      

module.exports = new AccountController();3