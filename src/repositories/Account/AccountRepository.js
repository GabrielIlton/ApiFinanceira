const AccountModel = require('../../models/account');//*Importa a collection de models


class AccountRepository {
    async findByDocumentCpf ({ cpf }) {
       return await AccountModel.findOne({ cpf });
    }

    async findByDocumentEmail ({ email }) {
       return await AccountModel.findOne({ email, deleted: false });
    }

    async createAccount ({ body }) {
        return await AccountModel.create({//*Requere e cria no banco os dados
            name: body.name[0].toUpperCase() + body.name.substring(1).toLowerCase(),
            cpf: body.cpf,
            email: body.email.toLowerCase(),
            password: body.password,
            endereco: {rua: body.endereco.rua, bairro: body.endereco.bairro, numero: body.endereco.numero},//*Cria um objeto no banco
            telefone: body.telefone
        });
    }

    async findById ({ id }) {
        return await AccountModel.findOne({ _id: id, deleted: false });
    }

    async findByAdmin ({ id }) {
        const accountAdmin = await AccountModel.findOne({ _id: id, deleted: false, admin: true });
        return accountAdmin;
    }

    async findAllAccounts ({}) {
        const allAccounts = await AccountModel.find({});
        return allAccounts;
    }

    async findOneAndUpadatePassword ({ id, passwordNew }) {
        const account = await AccountModel.findOneAndUpdate({ _id: id, deleted: false}, { password: passwordNew });//*Encontra o cpf não deletado e add um name novo
        return account;
    }
}

module.exports = new AccountRepository();