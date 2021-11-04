const Models = require('../../models/index');//*Importa a collection de models


class AccountRepository {
    async findByDocumentCpf ({ cpf }) {
        const account = await Models.AccountModel.findOne({ cpf });
        return account;
    }

    async findByDocumentEmail ({ email }) {
       return await Models.AccountModel.findOne({ email, deleted: false });
    }

    async createAccount ({ body }) {
        return await Models.AccountModel.create({//*Requere e cria no banco os dados
            name: body.name[0].toUpperCase() + body.name.substring(1).toLowerCase(),
            cpf: body.cpf,
            email: body.email.toLowerCase(),
            password: body.password,
            endereco: {rua: body.endereco.rua, bairro: body.endereco.bairro, numero: body.endereco.numero},//*Cria um objeto no banco
            telefone: body.telefone
        });
    }

    async findByAccountDeletedTrue ({ cpf }) {
        return await Models.AccountModel.findOne({ cpf, deleted: true });
    }

    async findById ({ id }) {
        const account = await Models.AccountModel.findOne({ _id: id, deleted: false });
        return account;
    }

    async findByAdmin ({ id }) {
        const accountAdmin = await Models.AccountModel.findOne({ _id: id, deleted: false, admin: true });
        return accountAdmin;
    }

    async findAllAccounts ({}) {
        const allAccounts = await Models.AccountModel.find({});
        return allAccounts;
    }

    async findOneAndUpadatePassword ({ id, passwordNew }) {
        const account = await Models.AccountModel.findOneAndUpdate({ _id: id, deleted: false}, { password: passwordNew });//*Encontra o cpf não deletado e add um name novo
        return account;
    }

    async findOneAndUpadateDelete ({ id }) {
        const accountDelete = await Models.AccountModel.findOneAndUpdate({ _id: id, deleted: false}, { deleted: true });
        return accountDelete;
    }

    async findOneAndUpadateRetrieve ({ cpf }) {
        const accountRetrieve = await Models.AccountModel.findOneAndUpdate({ cpf , deleted: true}, { deleted: false });
        return accountRetrieve;
    }

    async findOneAndUpdateBalance ({ id, total }) {
        const balanceAccount = await Models.AccountModel.findOneAndUpdate({ _id: id }, { balance: total });
        return balanceAccount;
    }  
}

module.exports = new AccountRepository();