const { AccountService } = require('../services/index');

class AccountController {
    async createAccount(req, res) {//*Create account 
        try {            
            const accountCreated = await AccountService.createAccount({ body: req.body });
        
            return res.status(201).json({ nome: accountCreated.name, email: accountCreated.email, message: "Sucesso ao criar conta." });
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
            const account = await AccountService.getAccountDetails({ token });

            const finalReturn = { 
                name: account.name,
                cpf: account.cpf,
                email: account.email,
                addres: {
                    street: account.address.street,
                    quarter: account.address.quarter,
                    number: account.address.number,
                },
                phone: account.phone,
                admin: account.admin
            };

            if(token.password){
                return res.status(200).json({ finalReturn });
            };

            return res.status(200).json({ name: finalReturn.name, email: finalReturn.email });  
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

    async getBalance (req, res) {//*Find balance account
        try {
            const { token } = res.auth;
            const returnFinal = await AccountService.getSaldo({ token });
            return res.status(200).json({ name: returnFinal.account.name, balance: returnFinal.balance });
          
        } catch (error) {
            return res.status(404).json({ error });
        };
    };

    async getAccounts (req, res) {//*Find all accounts
        try {   
            const { token } = res.auth;
            const accounts = await AccountService.getAccounts({ token });            
            
            if(token.passwordSecurity){
                const finalReturn = accounts.map(account => ({ 
                    name: account.name,
                    email: account.email
                }));
                return res.status(200).json({ finalReturn });
            }
            
            const finalReturn = accounts.map(account => ({ 
                name: account.name,
                cpf: account.cpf,
                email: account.email,
                addres: account.address,
                phone: account.phone,
                deleted: account.deleted,
                balance: account.balance,
                admin: account.admin
            }));
            
            return res.status(200).json({ finalReturn });
        }catch (error) {
            return res.status(400).json({ error });   
        }
    };
    
    async createPasswordSecurity(req, res) {
        try {
            const { token } = res.auth;

            await AccountService.accountPasswordSecurity({ token, body: req.body });

            return res.status(200).json({ message: "Sucesso ao criar senha de segurança." });
        } catch (error) {
            return res.status(400).json({ error });
        }
    };
    
    async updatePasswordAccount (req,res) {//*Put o password
        try {            
            const { token } = res.auth;

            const account = await AccountService.updatePasswordAccount({ body: req.body, token })
            return res.status(200).json({ name: account.name, message: "Senha alterada com sucesso." });//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async deleteAccount (req, res) {//*Delete account
        try {   
            const { token } = res.auth;
            const account = await AccountService.deleteAccount({ body: req.body, token })

            return res.status(200).json({ deleted: account.name, message: 'Deletado com sucesso.' });
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async retrieveAccount(req, res){//*Retrieve a conta caso esteja excluida 
        try {           
            const account = await AccountService.retrieveAccount({ body: req.body });
            return res.status(200).json({ name: account.name, message: 'Conta recuperada com sucesso.' });
        } catch (error) {
            return res.status(400).json({error})
        };
    };

    async depositAccount (req, res) { //*Deposit in account  
        try {   
            const { token } = res.auth;            
            const account = await AccountService.depositAccount({ body: req.body, token })
            
            return res.status(200).json({ name: account.name, balance: account.balance });
        
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async withdrawAccount (req, res) {//*WithDraw in account 
        try {
            const { token } = res.auth;            
            const account = await AccountService.withDrawAccount({ body: req.body, token });
            return res.status(200).json({ name: account.name, withdraw: req.body.withDraw, balance: account.balance - req.body.withDraw });
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async p2p (req, res) {//*P2P
        try {
            const { token } = res.auth;
            const { accountSend, accountReciever, response, balance } = await AccountService.p2p({ body: req.body, token });

            return res.status(200).json({ accountSend: accountSend.name, cashout: req.body.amount, balance: balance, accountReciever: accountReciever.name, cashin: req.body.amount, response: response.data });
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async callbackp2p (req, res) {
        try {
            return res.status(200).json({ Success: `${req.body.name}, sua transação foi realizada com sucesso.` });
        } catch (error) {
            return res.status(400).json({ error })
        }

    };
}      

module.exports = new AccountController();
