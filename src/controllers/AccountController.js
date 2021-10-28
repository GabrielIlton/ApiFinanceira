const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const StatementModel = require('../models/statement');//*Importa a collection statement
const TransactionModel = require('../models/transaction');//*Importa a collection transaction
const AccountService = require('../services/Account/AccountService');
const AccountRepository = require('../repositories/Account/AccountRepository');


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
            const loginAccount = await AccountService.loginAccount({ account });
            
            return res.status(200).json({ name: account.name, loginAccount });
    
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
            const getAccounts = await AccountService.getAccounts({ token });
            getAccounts.password = undefined;
            return res.status(200).json({ getAccounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };
    
    async updatePasswordAccount (req,res) {//*Put o password
        try {            
            const { token } = res.auth;

            const updatePasswordAccountVerify = await AccountService.updatePasswordAccount({ body: req.body, token })
            return res.status(200).json({name: updatePasswordAccountVerify.name, message: "Senha alterada com sucesso."});//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async deleteAccount (req, res) {//*Delete account
        try {   
            const { token } = res.auth;
            const { idAccountDelete } = req.body;

            if(token.admin === true) {
                const account = await AccountModel.findOne({ _id: idAccountDelete, deleted: false });
                if(!account) throw ' Conta não existe.';
                const deleteAccount = await AccountModel.findOneAndUpdate({ _id: account }, {deleted: true});
                return res.status(200).json({deleted: deleteAccount.name, message: 'Deletado com sucesso.'});
            }

            if(idAccountDelete) throw 'Você não tem acesso para deletar contas.';

            const deleteAccount = await AccountModel.findOneAndUpdate({ _id: token.account_id }, {deleted: true});

            return res.status(200).json({deleted: deleteAccount.name, message: 'Deletado com sucesso.'});
        } catch (error) {
            return res.status(400).json({error});
        }
    };

    async retrieveAccount(req, res){//*Retrieve a conta caso esteja excluida 
        try {
            const { cpf } = req.body;
            
            await AccountValidator.retrieveAccountValidator(req.body);//!Validators

            const accountVerifyCpf = await AccountModel.findOne({ cpf, deleted: false });//*Faz a pesquisa se cpf já existe
            if(accountVerifyCpf) throw 'Conta já existe.';
            if(!accountVerifyCpf){//*Verifica se existe Cpf
                if(accountVerifyCpf != false){
                    const verifyAccountCreated = await AccountModel.findOneAndUpdate({ cpf }, { deleted: false});//*Pesquisa e atualiza account deleted = true
                    return res.status(201).json({name: verifyAccountCreated.name, message: "Sua conta foi recuperada com sucesso."});
                }
            };
        } catch (error) {
            return res.status(400).json({error})
        };
    };

    async depositAccount (req, res) { //*Deposit in account  
        try {   
            const { token } = res.auth;//*Pega o ID importado de Auth.js 
            const { deposit } = req.body;//Desestruturação
            
            await AccountValidator.depositAccountValidator(req.body)

            const account = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            if(!account) throw 'Conta não existe.';
            await StatementModel.create({//*Instancia e cria no banco os dados no StatementModel
                type: 'deposit',
                amount: deposit,
                accountId: token.account_id
            });
            const total = deposit + account.balance;
            const depositAccount = await AccountModel.findOneAndUpdate({ _id: token.account_id }, { balance: total });
            
            return res.status(201).json({ name: depositAccount.name, saldo: total });
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {//*WithDraw in account 
        try {
            const { token } = res.auth;
            const { withDraw } = req.body;
            
            await AccountValidator.withdrawAccountValidator(req.body);//!Validators

            const account = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            if(!account) throw 'Conta não existe.';

            if(withDraw <= account.balance){
                await StatementModel.create({//*Instancia e cria no banco os dados
                    type: 'withDraw',
                    amount: withDraw,
                    accountId: token.account_id
                });
                const total = account.balance - withDraw;
                const withDrawAccount = await AccountModel.findOneAndUpdate({ _id: token.account_id }, { balance: total });

                return res.status(201).json({ nome: withDrawAccount.name, saque: withDraw, saldo: total });
            }else{
                return res.status(400).json({ message: 'Saldo insuficiente' });
            }
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async P2P (req, res) {//*P2P
        try {
            const { cpfReciever, amount} = req.body;
            const { token } = res.auth;
            
            await AccountValidator.P2PValidator(req.body);//!Validators

            const accountReciever = await AccountModel.findOne({ cpf: cpfReciever, deleted: false });
            const accountSend = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            
            if(!accountSend) throw 'Conta não existe.';
            if(!accountReciever) throw 'Conta de destinatário não existe';
            if(accountSend.balance < amount) throw 'Não tem saldo suficiente para a transação.';
            if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.'

            await TransactionModel.create({ 
                type: 'cashout',
                amount: amount,
                accountId: accountSend._id
            });
            const totalSend = accountSend.balance - amount;
            await AccountModel.findOneAndUpdate({ cpf: accountSend.cpf }, { balance: totalSend}, {new: true});

            await TransactionModel.create({
                type: 'cashin',
                amount: amount,
                accountId: accountReciever._id
            });
            const totalReciever = amount + accountReciever.balance;
            await AccountModel.findOneAndUpdate({ cpf: cpfReciever }, { balance: totalReciever}, {new: true});

            await StatementModel.create({
                type:'cashoutP2P',
                amount: amount,    
                accountId: accountSend._id
            });
            await StatementModel.create({ 
                type:'cashinP2P',
                amount: amount, 
                accountId: accountReciever._id
            });
            
            return res.status(201).json({ accountSend: accountSend.name, cashoutSend: amount, balanceSend: accountSend.balance - amount, Reciever: accountReciever.name, cashinReciever: amount});
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };
}      

module.exports = new AccountController();3