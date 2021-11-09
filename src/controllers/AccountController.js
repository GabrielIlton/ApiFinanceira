const Services = require('../services/index');
const axios = require('axios');

class AccountController {//*É uma classe que tem todas a funcion de account
    async createAccount(req, res) {//*Create account 
        try {            
            const accountCreated = await Services.AccountService.createAccount({ body: req.body })
        
            return res.status(201).json({ nome: accountCreated.name, email: accountCreated.email });
       }catch(error){
           return res.status(422).json({ error });    
       };
    };

    async loginAccount(req, res){//*Login account created
        try {
            const { account } = res.login;
            const token = await Services.AccountService.loginAccount({ account });
            
            return res.status(200).json({ name: account.name, token });
    
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async getAccountDetails (req, res) {//*Find one account
        try {            
            const { token } = res.auth;
            const account = await Services.AccountService.getAccountDetails({ token })
         
            const finalReturn = { 
                name: account.name,
                cpf: account.cpf,
                email: account.email,
                endereço: {
                    rua: account.endereco.rua,
                    bairro: account.endereco.bairro,
                    numero: account.endereco.numero,
                },
                telefone: account.telefone,
                admin: account.admin
            };

            return res.status(200).json({ finalReturn });
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

    async getSaldo (req, res) {//*Find balance account
        try {
            const { token } = res.auth;
            const account = await Services.AccountService.getSaldo({ token });
            return res.status(200).json({ Nome: account.name, Balance: account.balance });
          
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };

    async getAccounts (req, res) {//*Find all accounts
        try {   
            const { token } = res.auth;
            const accounts = await Services.AccountService.getAccounts({ token });
            const finalReturn = accounts.map(account => ({ 
                name: account.name,
                cpf: account.cpf,
                email: account.email,
                endereco: account.endereco,
                telefone: account.telefone,
                deleted: account.deleted,
                balance: account.balance,
                admin: account.admin
            }));
            return res.status(200).json({ finalReturn });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };
    
    async updatePasswordAccount (req,res) {//*Put o password
        try {            
            const { token } = res.auth;

            const account = await Services.AccountService.updatePasswordAccount({ body: req.body, token })
            return res.status(200).json({name: account.name, message: "Senha alterada com sucesso."});//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async deleteAccount (req, res) {//*Delete account
        try {   
            const { token } = res.auth;
            const account = await Services.AccountService.deleteAccount({ body: req.body, token })

            return res.status(200).json({deleted: account.name, message: 'Deletado com sucesso.'});
        } catch (error) {
            return res.status(400).json({error});
        }
    };

    async retrieveAccount(req, res){//*Retrieve a conta caso esteja excluida 
        try {           
            const account = await Services.AccountService.retrieveAccount({ body: req.body });
            return res.status(200).json({ name: account.name, message: 'Conta recuperada com sucesso.' });
        } catch (error) {
            return res.status(400).json({error})
        };
    };

    async depositAccount (req, res) { //*Deposit in account  
        try {   
            const { token } = res.auth;            
            const account = await Services.AccountService.depositAccount({ body: req.body, token })
            
            return res.status(201).json({ name: account.name, saldo: account.balance });
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {//*WithDraw in account 
        try {
            const { token } = res.auth;            
            const account = await Services.AccountService.withDrawAccount({ body: req.body, token })
            return res.status(201).json({ nome: account.name, saque: req.body.withDraw, saldo: account.balance });
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async p2p (req, res) {//*P2P
        try {
            const { token } = res.auth;
            const { accountSend, accountReciever, response } = await Services.AccountService.p2p({ body: req.body, token });

            return res.status(200).json({ accountSend: accountSend.name, cashout: req.body.amount, saldo: accountSend.balance - req.body.amount, accountReciever: accountReciever.name, cashin: req.body.amount, response: response.data });//!ACERTAR
        } catch (error) {
            return res.status(400).json({ message: error });//?Retorna o status
        }
    };

    async callbackp2p (req, res) {
        try {
            return res.status(200).json({ Sucesso: `${req.body.name}, sua transação foi realizada com sucesso.` });
        } catch (error) {
            return res.status(400).json({ message: error })
        }

    };
}      

module.exports = new AccountController();