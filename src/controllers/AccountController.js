const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const AccountModel = require('../models/account');//*Importa a collection de models
const StatementModel = require('../models/statement');

class AccountController {//*É uma classe que tem todas a funcion de account
    async createAccount(req, res) {
       try{//*Testa realizar
        const {name, cpf, endereco, telefone} = req.body;

        if(!name) throw 'Nome é obrigatório.';//*Verifica se nome exixte
        if(!cpf) throw 'CPF é obrigatório.';//*Verifica se cpf existe
        if(!endereco) throw 'Endereco é obrigatório.';//*Verifica se endereço existe
        if(!telefone) throw 'Telefone é obrigatório.';//*Verifica se telefone existe
        
        const account = await AccountModel.findOne({ cpf });//*Faz a pesquisa se cpf já existe
        if(account) throw 'CPF já cadastrado.' 
        if(account){
            const accountCreated = await AccountModel.findOneAndUpdate({ cpf }, { deleted: false});
            return res.status(201).json({retorno: accountCreated});
        };
        const retorno = await AccountModel.create({//*Instancia e cria no banco os dados
            name,
            cpf,
            endereco: {rua: endereco.rua, bairro: endereco.bairro, numero: endereco.numero},
            telefone
        });

        if(!retorno) throw 'Erro ao cadastrar.';

        return res.status(201).json({retorno});

       }catch(error){//*Dá o erro se a tentativa falhar
           return res.status(422).json({error});    
       };
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
            
            return res.status(201).json({ depositAccount });
        
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

    async updateName (req,res) {
        try {
            const { name } = req.body;//*Pega do corpo
            const { cpf } = req.params;//*Pega do parametro 
            const account = await AccountModel.findOneAndUpdate({ cpf, deleted: false }, { name }, { new: true });//*Encontra o cpf não deletado e add um name novo
            if(!account) throw 'Conta não existe.';//*Verifica se a conta exixte
            return res.status(200).json({account});//*Retorna o status de sucesso
        } catch (error) {
            return res.status(400).json({error});//*Retorna o status de erro   
        }
    };

    async getAccount (req, res) {
        try {
            const accounts = await AccountModel.find({}, {name:1 ,cpf: 1});//*Primeiro parametro eh a pesquisa e o segundo vai mostrar
            if(!accounts) throw 'Conta não existe.';
            return res.status(200).json({ accounts });
        }catch (error) {
            return res.status(400).json({message: error});   
        }
    };

    async getAccountDetails (req, res) {
        try {
            const { cpf } = req.params;
            const accounts = await AccountModel.findOne({cpf, deleted: false});
            if(!accounts) throw 'Conta não existe.';
            return res.status(200).json({ accounts });
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
            
            return res.status(201).json({ depositAccount });
        
        } catch (error) {
            return res.status(400).json({message: error.message});//?Retorna o status
        }
    };
}      

module.exports = new AccountController();