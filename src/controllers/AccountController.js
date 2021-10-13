const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const AccountModel = require('../models/account');//*Importa a collection de models
const StatementModel = require('../models/statement');
const TransactionModel = require('../models/transaction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

class AccountController {//*É uma classe que tem todas a funcion de account
    async createAccount(req, res) {
       try{//*Testa realizar
        const { name, cpf, endereco, telefone, email, password } = req.body;

        if(!name) throw 'Nome é obrigatório.';//*Verifica se nome exixte
        if(!cpf) throw 'CPF é obrigatório.';//*Verifica se cpf existe
        if(!endereco) throw 'Endereco é obrigatório.';//*Verifica se endereço existe
        if(!telefone) throw 'Telefone é obrigatório.';//*Verifica se telefone existe
        if(!email) throw 'Email é obrigatório.';
        if(!password) throw 'Senha é obrigatória.';
        
        const accountVerifyCpf = await AccountModel.findOne({ cpf });//*Faz a pesquisa se cpf já existe
        const accountVerifyEmail = await AccountModel.findOne({ email });
        if(accountVerifyCpf && accountVerifyEmail){
            if(accountVerifyCpf != false){
            const accountCreated = await AccountModel.findOneAndUpdate({ cpf, email }, { deleted: false});
            return res.status(201).json({name: accountCreated.name, cpf: accountCreated.cpf, email: accountCreated.email});
            }
        };
        if(accountVerifyCpf || accountVerifyEmail){
            return res.json({ message: 'CPF ou email já existente.' });
        };
       
        const accountCreated = await AccountModel.create({//*Instancia e cria no banco os dados
            name,
            cpf,
            email,
            password,
            endereco: {rua: endereco.rua, bairro: endereco.bairro, numero: endereco.numero},
            telefone
        });

        if(!accountCreated) throw 'Erro ao cadastrar.';
        accountCreated.password = undefined;

        return res.status(201).json({ accountCreated });

       }catch(error){//*Dá o erro se a tentativa falhar
           return res.status(422).json({ error });    
       };
    };
    async loginAccount(req, res){
        try {
            const { email, password } = req.body;
            const account = await AccountModel.findOne({ email, deleted: false });
            if(!account) throw 'Conta não existe.';
            const passwordCorrect = await bcrypt.compare(password, account.password);
            if(!passwordCorrect) throw 'Senha incorreta.';
            account.password = undefined;

            const token = jwt.sign({ 
                account_id: account._id
            },
                authConfig.secret,
            
            );
            return res.status(200).json({ account, token });
        } catch (error) {
            return res.status(400).json({error});
        }
    };

    async depositAccount (req, res) {   
        try {   
            const { id } = res.auth;
            const { deposit } = req.body;//Desestruturação
            
            await StatementModel.create({//*Instancia e cria no banco os dados
                type: 'deposit',
                amount: deposit,
                accountId: id.account_id
            });
            const retorno = await AccountModel.findOne({ _id: id.account_id });
            const total = deposit + retorno.balance;
            const depositAccount = await AccountModel.findOneAndUpdate({ _id: id.account_id }, { balance: total });
            
            return res.status(201).json({ name: depositAccount.name, total });
        
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {
        try {
            const { id } = res.auth;
            const { withDraw } = req.body;//Desestruturação

            const accountBalance = await AccountModel.findOne({ _id: id.account_id });
            if(accountBalance.balance > 0 && withDraw <= accountBalance.balance){

            await StatementModel.create({//*Instancia e cria no banco os dados
                type: 'withDraw',
                amount: withDraw,
                accountId: id.account_id
            });
            const total = accountBalance.balance - withDraw;
            const withDrawAccount = await AccountModel.findOneAndUpdate({ _id: id.account_id }, { balance: total });
            
            return res.status(201).json({ name: withDrawAccount.name, total });
            }else{
                return res.status(400).json({message: 'Saldo insuficiente'});
            }
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async getAccount (req, res) {
        try {            
            const accounts = await AccountModel.find({  }, {name:1, cpf:1});//*Primeiro parametro eh a pesquisa e o segundo vai mostrar
            if(!accounts) throw 'Conta não existe.';
            accounts.password = undefined;

            return res.status(200).json({ accounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };

    async getAccountDetails (req, res) {
        try {            
            const { id } = res.auth;
            const account = await AccountModel.findOne({ _id: id.account_id });
            return res.status(200).json({ account });
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

   async deleteAccount  (req, res) {
        try {
            const { id } = res.auth;
            const verifyDeletedAccount = await AccountModel.findOne({ idAccount: id.account_id, deleted: true });
            if(verifyDeletedAccount) throw 'Conta já deletada.';
            const updateDelete = await AccountModel.findOneAndUpdate({ _id: id.account_id }, {deleted: true});
            return res.status(200).json({deleted: updateDelete.name, message: 'Deletado com sucesso.'});
        } catch (error) {
            return res.status(400).json({error});
        }
    };

   async transactionAccount (req, res) {
        try {
            const { cpfReciever, amount} = req.body;
            const { id } = res.auth;
            const accountReciever = await AccountModel.findOne({ cpf: cpfReciever, deleted: false });//*Faz a pesquisa se cpf já existe
            const accountSend = await AccountModel.findOne({ _id: id.account_id, deleted: false });
            
            if(!accountSend)  return res.status(400).json({ message: 'Conta não existe.' });
            if(!accountSend.balance > 0) return res.status(400).json({ message: 'Saldo insuficiente para a transação' });
            if(!accountReciever) return res.status(400).json({ message: 'Conta de destinatário não existe' });
            if(accountSend.balance < amount) throw 'Não tem saldo suficiente para a transação.';
            
            const cashoutUpdate = await TransactionModel.create({//*Instancia e cria no banco os dados 
                type: 'cashout',
                amount: amount,//*Ammount
                accountId: accountSend._id
            });
            const totalSend = accountSend.balance - amount;
            const accountSendUpdate = await AccountModel.findOneAndUpdate({ cpf: accountSend.cpf }, { balance: totalSend}, {new: true});

            const cashinUpdate = await TransactionModel.create({//*Instancia e cria no banco os dados
                type: 'cashin',
                amount: amount,
                accountId: accountReciever._id
            });
            const totalReciever = amount + accountReciever.balance;
            const cashinAccount = await AccountModel.findOneAndUpdate({ cpf: cpfReciever }, { balance: totalReciever}, {new: true});

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
            
            return res.status(201).json({ name: accountSend.name, balanceSend: accountSend.balance - amount });
        
        } catch (error) {
            return res.status(400).json({message: error});//?Retorna o status
        }
    };

    async updateAccount (req,res) {
        try {            
            const { id } = res.auth;
            const { name, passwordOld, email, passwordNew } = req.body;//*Pega do corpo
            
            const accountVerify = await AccountModel.find({ email, passwordOld, id: id.account_id});
            if(!accountVerify){
                const passwordNewHash = await bcrypt.hash(passwordNew, 10);
                const accountVerify = await AccountModel.findOneAndUpdate( {cpf}, { email , password: passwordNewHash});
                return res.status(201).json({ accountVerify });
            }
            else{
                const accountTest = await AccountModel.findOne({ email });
                if(!accountTest) throw 'Conta não existe.';//*Verifica se a conta exixte
                const passwordCorrect = await bcrypt.compare(passwordOld, accountTest.password);
                if(passwordOld === passwordNew) throw 'A senha antiga é igual a digitada, para alterar digite uma diferente.';
                if(!passwordCorrect) throw 'Senha incorreta.';
                const passwordNewHash = await bcrypt.hash(passwordNew, 10);
                const account = await AccountModel.findOneAndUpdate({id: id.account_id, deleted: false}, {password: passwordNewHash});//*Encontra o cpf não deletado e add um name novo
                account.password = undefined;
                return res.status(200).json({account});//*Retorna o status de sucesso
            }
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async getSaldo (req, res) {
        try {
            const { id } = res.auth;
            const account = await AccountModel.findOne({ _id: id.account_id, deleted: false });
            if(!account) throw 'Conta não existe.';
            return res.status(200).json({ Nome: account.name, Saldo: account.balance });
          
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };
}      

module.exports = new AccountController();