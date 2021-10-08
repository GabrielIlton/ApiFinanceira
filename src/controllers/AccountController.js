const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const AccountModel = require('../models/account');//*Importa a collection de models
const StatementModel = require('../models/statement');
const TransactionModel = require('../models/transaction');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        
        const account = await AccountModel.findOne({ cpf, email });//*Faz a pesquisa se cpf já existe
        if(account) throw 'CPF já cadastrado.' 
        // if(email) throw 'Email já cadastrado.' 
        if(account){
            const accountCreated = await AccountModel.findOneAndUpdate({ cpf }, { deleted: false});
            return res.status(201).json({retorno: accountCreated});
        };
        const retorno = await AccountModel.create({//*Instancia e cria no banco os dados
            name,
            cpf,
            email,
            password,
            endereco: {rua: endereco.rua, bairro: endereco.bairro, numero: endereco.numero},
            telefone
        });

        if(!retorno) throw 'Erro ao cadastrar.';
        retorno.password = undefined;

        return res.status(201).json({retorno});

       }catch(error){//*Dá o erro se a tentativa falhar
           return res.status(422).json({error});    
       };
    };

    async loginAccount(req, res){
        try {
            const { email, password } = req.body;
            const account = await AccountModel.findOne({ email });

            if(!account) throw 'Conta não existe.';
            const passwordCorrect = await bcrypt.compare(password, account.password);
            if(!passwordCorrect) throw 'Senha incorreta.';
            return res.status(200).json({ account });
        } catch (error) {
            return res.status(400).json({error});
        }
    };

    async depositAccount (req, res) {
        try {
            const{ cpf } = req.params;
            const { deposit } = req.body;//Desestruturação
            const account = await AccountModel.findOne({cpf, deleted: false});//*Faz a pesquisa se cpf já existe
            if(!account) throw 'Conta não existe';
            
            await StatementModel.create({//*Instancia e cria no banco os dados
                type: 'deposit',
                amount: deposit,
                accountId: account._id.toString()
            });
            const total = deposit + account.balance;
            const depositAccount = await AccountModel.findOneAndUpdate({ cpf, deleted: false }, { balance: Number(total)});
            
            return res.status(201).json({name: account.name, total });;
        
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async withdrawAccount (req, res) {
        try {
            const{ cpf } = req.params;
            const { withDraw } = req.body;//Desestruturação
            const account = await AccountModel.findOne({cpf, deleted: false});//*Faz a pesquisa se cpf já existe
            if(!account) throw 'Conta não existe';
            
            await StatementModel.create({//*Instancia e cria no banco os dados
                type: 'withDraw',
                amount: withDraw,
                accountId: account._id.toString()
            });
            const total = account.balance - withDraw;
            const withDrawAccount = await AccountModel.findOneAndUpdate({ cpf, deleted: false }, { balance: Number(total)});
            
            return res.status(201).json({ withDrawAccount });
        
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async updateAccount (req,res) {
        try {
            const { cpf } = req.params;//*Pega do parametro 
            const { name, password, email, passwordNew } = req.body;//*Pega do corpo
            
            const accountTest = await AccountModel.findOne({ email });
            if(!accountTest) throw 'Conta não existe.';//*Verifica se a conta exixte
            const passwordCorrect = await bcrypt.compare(password, accountTest.password);
            if(!passwordCorrect) throw 'Senha incorreta.';
            const passwordNewHash = await bcrypt.hash(passwordNew, 10);
            const account = await AccountModel.findOneAndUpdate({cpf, deleted: false}, {password: passwordNewHash});//*Encontra o cpf não deletado e add um name novo
            // account.password = undefined;
            return res.status(200).json({account});//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async getAccount (req, res) {
        try {
            const accounts = await AccountModel.find({}, {name:1, cpf:1});//*Primeiro parametro eh a pesquisa e o segundo vai mostrar
            if(!accounts) throw 'Conta não existe.';
            accounts.password = undefined;

            return res.status(200).json({ accounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };

    async getAccountDetails (req, res) {
        try {
            const { cpf } = req.params;
            const account = await AccountModel.findOne({ cpf, deleted: false });
            if(!account) throw 'Conta não existe.';
            return res.status(200).json({ account });
        }catch (error) {
            return res.status(400).json({error});   
        }
    };

   async deleteAccount  (req, res) {
        try {
            const { cpf } = req.params;
            const account = await AccountModel.findOne({ cpf, deleted: false });
            if(!account) throw 'Conta não existe.';
            await AccountModel.updateOne({ cpf, deleted: false}, {deleted: true});
            return res.status(200).json({message: 'Deletado com sucesso.'});
        } catch (error) {
            return res.status(400).json({error});
        }
    };

   async transactionAccount (req, res) {
        try {
            const { cpfReciever, amount} = req.body;
            const { accountId } = res;
            const accountReciever = await AccountModel.findOne({ cpf: cpfReciever, deleted: false });//*Faz a pesquisa se cpf já existe
            const accountSend = await AccountModel.findOne({ _id: accountId._id });
            
            if(!accountSend.balance > 0) throw 'Não tem saldo.';
            if(!accountReciever) throw 'Conta não existe';
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
            
            return res.status(201).json({ balanceSend: accountSend.balance - amount });
        
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };

    async getSaldo (req, res) {
        try {
            const { cpf } = req.params;
            const account = await AccountModel.findOne({ cpf, deleted: false });
            if(!account) throw 'Conta não existe.';
            return res.status(200).json({ Nome: account.name, Saldo: account.balance });
          
        } catch (error) {
            return res.status(404).json({message: error.message});
        };
    };
}      

module.exports = new AccountController();