const { AccountModel } = require('../../models/index');

class AccountRepository {
    async findByDocumentCpf ({ cpf }) {
        const account = await AccountModel.findOne({ cpf });
        return account;
    };

    async findByDocumentEmail ({ email }) {
       return await AccountModel.findOne({ email, deleted: false });
    };

    async createAccount ({ body }) {
        return await AccountModel.create({
            name: body.name[0].toUpperCase() + body.name.substring(1).toLowerCase(),
            cpf: body.cpf,
            email: body.email.toLowerCase(),
            password: body.password,
            address: {street: body.address.street, quarter: body.address.quarter, number: body.address.number},
            phone: body.phone,
            admin: body.admin
        });
    };

    async createPasswordSecurity ({ id, passwordSecurity }) {
        return await AccountModel.findOneAndUpdate({ _id: id,  }, { passwordSecurity });
    };

    async updateBalanceSecurity ({ id, balanceSecurity }) {
        return await AccountModel.findOneAndUpdate({ _id: id,  }, { balanceSecurity });
    };

    async findByAccountDeletedTrue ({ cpf }) {
        return await AccountModel.findOne({ cpf, deleted: true });
    };

    async findById ({ id }) {
        const account = await AccountModel.findOne({ _id: id, deleted: false }).lean();
        return account;
    };

    async findByAdmin ({ id }) {
        const accountAdmin = await AccountModel.findOne({ _id: id, deleted: false, admin: true });
        return accountAdmin;
    };

    async findAllAccounts ({}) {
        const allAccounts = await AccountModel.find({});
        return allAccounts;
    };

    async findOneAndUpadatePassword ({ id, passwordNew }) {
        const account = await AccountModel.findOneAndUpdate({ _id: id, deleted: false}, { password: passwordNew });
        return account;
    };

    async findOneAndUpadateDelete ({ id }) {
        const accountDelete = await AccountModel.findOneAndUpdate({ _id: id, deleted: false}, { deleted: true });
        return accountDelete;
    };

    async findOneAndUpadateRetrieve ({ cpf }) {
        const accountRetrieve = await AccountModel.findOneAndUpdate({ cpf , deleted: true}, { deleted: false });
        return accountRetrieve;
    };

    async findOneAndUpdateBalance ({ id, total }) {
        const balanceAccount = await AccountModel.findOneAndUpdate({ _id: id }, { balance: total }, { new: true });
        return balanceAccount;
    };
}

module.exports = new AccountRepository();