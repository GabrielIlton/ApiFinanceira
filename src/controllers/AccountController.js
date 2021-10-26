const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const AccountModel = require('../models/account');//*Importa a collection de models
const StatementModel = require('../models/statement');//*Importa a collection statement
const TransactionModel = require('../models/transaction');//*Importa a collection transaction
const jwt = require('jsonwebtoken');//*Importa o jsonwebtoken
const bcrypt = require('bcryptjs');//*Importa o bcryptjs
const authConfig = require('../config/auth');//*Importa o authConfig
const AccountValidator = require('../validators/AccountValidators/Account');
// const multerConfig = require('../config/multer');


class AccountController {//*É uma classe que tem todas a funcion de account
    //! ADD Documentation
    async createAccount(req, res) {//*Create account 
        try {
            const { name , cpf, endereco, telefone, email, password, admin } = req.body;//*Pega os dados do body da requisição
            
            await AccountValidator.accountCreateValidator(req.body);//!Validators
            
            const accountVerifyCpf = await AccountModel.findOne({ cpf });//*Faz a pesquisa se cpf já existe
            const accountVerifyEmail = await AccountModel.findOne({ email });//*Faz a pesquisa se email já existe
    
            if(accountVerifyCpf || accountVerifyEmail) throw 'CPF ou email já existente.';//*Retorna o erro caso já exista CPF  ou email
            const accountCreated = await AccountModel.create({//*Requere e cria no banco os dados
                name: name[0].toUpperCase() + name.substring(1).toLowerCase(),
                cpf,
                email: email.toLowerCase(),
                password,
                endereco: {rua: endereco.rua, bairro: endereco.bairro, numero: endereco.numero},//*Cria um objeto no banco
                telefone,
                admin//!
            });
        accountCreated.password = undefined;//*Não retorna o password
        return res.status(201).json({ accountCreated });//*Retona account

       }catch(error){//*Dá o erro se a tentativa falhar
           return res.status(422).json({ error });    
       };
    };

    async loginAccount(req, res){//*Login account created
        try {
            const { email, password } = req.body;
            const { account } = res.login;
            
            email.toLowerCase();
            const token = jwt.sign({//*Gera o token com o ID de account
                account_id: account._id, //*Contém o ID de account no token
                email: account.email,
                password: account.password,
                admin: account.admin
            }, 
                authConfig.secret, 
            {
                expiresIn: '1h'
            });
            return res.status(200).json({ name: account.name, token });
    
        } catch (error) {
            return res.status(400).json({ error });
        }
    };

    async getAccountDetails (req, res) {//*Find one account
        try {            
            const { token } = res.auth;
            const account = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            if(!account) throw 'Conta não existe ou está deletada.';
            account.password = undefined;
            return res.status(200).json({ account });
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

    async getSaldo (req, res) {//*Find o saldo de uma account
        try {
            const { token } = res.auth;
            const account = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            if(!account) throw 'Conta não existe.';
            return res.status(200).json({ Nome: account.name, Balance: account.balance });
          
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };

    async getAccounts (req, res) {//*Find all accounts
        try {   
            const { token } = res.auth;
            const account = await AccountModel.findOne({ _id: token.account_id, admin: true }); 
            if(!account) throw 'Você não tem acesso a essa rota.'
            const accounts = await AccountModel.find({ });//*Primeiro parametro eh a pesquisa e o segundo vai mostrar
            if(!accounts) throw 'Conta não existe.';
            accounts.password = undefined;

            return res.status(200).json({ accounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };
    
    async updatePasswordAccount (req,res) {//*Put o password
        try {            
            const { token } = res.auth;
            const { passwordOld, email, passwordNew } = req.body;//*Pega do corpo
            
            await AccountValidator.updatePasswordAccountValidator(req.body);//!Validators

            const accountVerify = await AccountModel.findOne({ email });
            if(!accountVerify) throw 'Conta não existe ou email incorreto.';
            
            if(!accountVerify){
                const passwordNewHash = await bcrypt.hash(passwordNew, 10);
                const accountVerify = await AccountModel.findOneAndUpdate( {cpf}, { email , password: passwordNewHash});
                return res.status(201).json({ accountVerify });
            }
            else{               
                const passwordCorrect = await bcrypt.compare(passwordOld, accountVerify.password);
                if(passwordOld === passwordNew) throw 'A senha antiga é igual a digitada, para alterar, digite uma diferente.';
                if(!passwordCorrect) throw 'Senha incorreta.';
                if(passwordNew.length <= 3) throw 'Senha nova deve ser maior que 4 dígitos.';
                const passwordNewHash = await bcrypt.hash(passwordNew, 10);
                const account = await AccountModel.findOneAndUpdate({_id: token.account_id, deleted: false}, {password: passwordNewHash});//*Encontra o cpf não deletado e add um name novo
                
                return res.status(200).json({name: account.name, cpf: account.cpf, email: account.email, message: "Senha alterada com sucesso."});//*Retorna o status de sucesso
            }
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async deleteAccount (req, res) {//*Delete account
        try {
            const { token } = res.auth;

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
                    return res.status(201).json({name: verifyAccountCreated.name, cpf: verifyAccountCreated.cpf, email: verifyAccountCreated.email, deleted: "false"});
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
            
            return res.status(201).json({ name: depositAccount.name, total });
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {//*WithDraw in account 
        try {
            const { token } = res.auth;
            const { withDraw } = req.body;//Desestruturação
            
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

                return res.status(201).json({ nome: withDrawAccount.name, saque: withDraw, total });
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

            const accountReciever = await AccountModel.findOne({ cpf: cpfReciever, deleted: false });//*Faz a pesquisa se cpf já existe e não deletado
            const accountSend = await AccountModel.findOne({ _id: token.account_id, deleted: false });
            
            if(!accountSend) throw 'Conta não existe.';
            if(!accountReciever) throw 'Conta de destinatário não existe';
            if(accountSend.balance < amount) throw 'Não tem saldo suficiente para a transação.';
            if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.'

            await TransactionModel.create({//*Instancia e cria no banco os dados 
                type: 'cashout',
                amount: amount,//*Ammount
                accountId: accountSend._id
            });
            const totalSend = accountSend.balance - amount;
            await AccountModel.findOneAndUpdate({ cpf: accountSend.cpf }, { balance: totalSend}, {new: true});

            await TransactionModel.create({//*Instancia e cria no banco os dados
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

module.exports = new AccountController();