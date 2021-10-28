const AccountValidator = require('../../validators/AccountValidators/Account');
const AccountRepository = require('../../repositories/Account/AccountRepository');
const jwt = require('jsonwebtoken');//*Importa o jsonwebtoken
const authConfig = require('../../config/auth');//*Importa o authConfig
const bcrypt = require('bcryptjs');//*Importa o bcryptjs


class AccountService {
    async createAccount ({ body }) { 
        await AccountValidator.accountCreateValidator(body);

        const accountVerifyCpf = await AccountRepository.findByDocumentCpf({ cpf: body.cpf })
        const accountVerifyEmail = await AccountRepository.findByDocumentEmail({ email: body.email });//*Faz a pesquisa se email já existe
        if(accountVerifyCpf || accountVerifyEmail) throw 'CPF ou email já existente.';

        return await AccountRepository.createAccount({ body }) 
    }

    async loginAccount ({ account }) {
        const formatedEmail = account.email.toLowerCase();
        const token = jwt.sign({//*Gera o token com o ID de account
            account_id: account._id, //*Contém o ID de account no token
            email: formatedEmail,
            password: account.password,
            admin: account.admin,
        }, 
            authConfig.secret, 
        {
            expiresIn: '1h'
        });
        return token;
    }

    async getAccountDetails ({ token }) {
        return await AccountRepository.findById({ id: token.account_id })
    }

    async getSaldo ({ token }) {
        return await AccountRepository.findById({ id: token.account_id })
    }

    async getAccounts ({ token }) {
        const accountAdmin = await AccountRepository.findByAdmin({ id: token.account_id });
        if(!accountAdmin) throw 'Você não tem acesso a essa rota.';
        const allAccounts = await AccountRepository.findAllAccounts({ });
        return allAccounts;
    }

    async updatePasswordAccount ({ body, token }) {
        await AccountValidator.updatePasswordAccountValidator( body );
        const verifyEmail = await AccountRepository.findByDocumentEmail({ email: body.email });
        if(verifyEmail.email !== token.email) throw 'Email incorreto.';

        const verifyPassword = await bcrypt.compare(body.passwordOld, verifyEmail.password);
        if(!verifyPassword) throw 'Senha incorreta.';
        if(body.passwordOld === body.passwordNew) throw 'A senha antiga é igual a digitada, para alterar, digite uma diferente.';
        if(body.passwordNew.length <= 3) throw 'Senha nova deve ser maior que 4 dígitos.';
        const passwordNewHash = await bcrypt.hash(body.passwordNew, 10);
        const account = await AccountRepository.findOneAndUpadatePassword({ id: token.account_id, passwordNew: passwordNewHash });
        return account;
    }
}

module.exports = new AccountService();