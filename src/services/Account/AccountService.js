const Validators = require('../../validators/index');
const jwt = require('jsonwebtoken');//*Importa o jsonwebtoken
const authConfig = require('../../config/auth');//*Importa o authConfig
const bcrypt = require('bcryptjs');//*Importa o bcryptjs
const Repositories = require('../../repositories/index');
const axios = require('axios');


class AccountService {
    async createAccount ({ body }) { 
        await Validators.AccountValidators.accountCreateValidator(body);

        const accountVerifyCpf = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf })
        const accountVerifyEmail = await Repositories.AccountRepository.findByDocumentEmail({ email: body.email });//*Faz a pesquisa se email já existe
        if(accountVerifyCpf || accountVerifyEmail) throw 'CPF ou email já existente.';

        return await Repositories.AccountRepository.createAccount({ body }) 
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
            expiresIn: authConfig.expires
        });
        return token;
    }

    async getAccountDetails ({ token }) {
        return await Repositories.AccountRepository.findById({ id: token.account_id })
    }

    async getSaldo ({ token }) {
        return await Repositories.AccountRepository.findById({ id: token.account_id })
    }

    async getAccounts ({ token }) {
        const accountAdmin = await Repositories.AccountRepository.findByAdmin({ id: token.account_id });
        if(!accountAdmin) throw 'Você não tem acesso a essa rota.';
        const allAccounts = await Repositories.AccountRepository.findAllAccounts({ });
        return allAccounts;
    }

    async updatePasswordAccount ({ body, token }) {
        await Validators.AccountValidators.updatePasswordAccountValidator( body );

        const verifyEmail = await Repositories.AccountRepository.findByDocumentEmail({ email: body.email });
        if(!verifyEmail) throw 'Conta não existe.';
        if(verifyEmail.email !== token.email) throw 'Email incorreto.';

        const verifyPassword = await bcrypt.compare(body.passwordOld, verifyEmail.password);
        if(!verifyPassword) throw 'Senha incorreta.';
        if(body.passwordOld === body.passwordNew) throw 'A senha antiga é igual a digitada, para alterar, digite uma diferente.';
        if(body.passwordNew.length <= 3) throw 'Senha nova deve ser maior que 4 dígitos.';
        const passwordNewHash = await bcrypt.hash(body.passwordNew, 10);
        const account = await Repositories.AccountRepository.findOneAndUpadatePassword({ id: token.account_id, passwordNew: passwordNewHash });
        return account;
    }

    async deleteAccount ({ body, token }) {
        if(token.admin === true) {
            await Validators.AccountValidators.deleteAccountValidator( body );
            const findCpf = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf });
            const deleteAccount = await Repositories.AccountRepository.findOneAndUpadateDelete({ id: findCpf.id });
            if(!deleteAccount) throw 'Conta não existe.';
            return deleteAccount;
        }
        if(body.cpf) throw 'Você não tem acesso para deletar contas.';

        const deleteAccount = await Repositories.AccountRepository.findOneAndUpadateDelete({ id: token.account_id });
        return deleteAccount;
    }

    async retrieveAccount ({ body }) { 
        await Validators.AccountValidators.retrieveAccountValidator( body );//!Validators

        const accountExists = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf });
        if(!accountExists) throw 'Conta não existe.';
        const accountVerify = await Repositories.AccountRepository.findByAccountDeletedTrue({ cpf: body.cpf});
        if(!accountVerify) throw 'Conta já existe.';
        if(accountVerify){
            const accountRetrieve = await Repositories.AccountRepository.findOneAndUpadateRetrieve({ cpf: accountVerify.cpf });
            return accountRetrieve;
        };
    }

    async depositAccount ({ body, token }) {
        await Validators.AccountValidators.depositAccountValidator( body )
        
        const createDeposit = await Repositories.StatementRepository.depositCreateStatement({ deposit: body.deposit, token });
        const accountBalance = await Repositories.AccountRepository.findById({ id: token.account_id });

        const total = body.deposit + accountBalance.balance; 
        const depositAccount = await Repositories.AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
        const account = await Repositories.AccountRepository.findById({ id: token.account_id });
        
        return account;
    }

    async withDrawAccount ({ body, token }) {
        await Validators.AccountValidators.withdrawAccountValidator(body);//!Validators
        const accountBalance = await Repositories.AccountRepository.findById({ id: token.account_id });

        if(body.withDraw <= accountBalance.balance){
            await Repositories.StatementRepository.withDrawCreateStatement({ withDraw: body.withDraw, token });
            const total = accountBalance.balance - body.withDraw;
            const withDrawAccount = await Repositories.AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
            const account = await Repositories.AccountRepository.findById({ id: token.account_id });
            return account;
        }else{
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }
    }

    async p2p ({ body, token }) {
        await Validators.AccountValidators.P2PValidator(body);

        const accountReciever = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });
        const accountSend = await Repositories.AccountRepository.findById({ id: token.account_id });
        
        if(!accountReciever) throw 'Conta de destinatário não existe';
        if(accountSend.balance < body.amount) throw 'Não tem saldo suficiente para a transação.';
        if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.';

        await Repositories.TransactionRepository.P2Pcashout({ accountSend, amount: body.amount });

        const totalSend = accountSend.balance - body.amount;
        const accountIdSend = await Repositories.AccountRepository.findByDocumentCpf({ cpf: accountSend.cpf });

        await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountIdSend._id.toString(), total: totalSend });
        await Repositories.TransactionRepository.P2Pcashin({ accountReciever, amount: body.amount });

        const totalReciever = body.amount + accountReciever.balance;
        const accountIdReciever = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });

        await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountIdReciever._id.toString(), total: totalReciever });
        await Repositories.StatementRepository.P2PcashoutCreate({ amount: body.amount, accountSend });
        await Repositories.StatementRepository.P2PcashinCreate({ amount: body.amount, accountReciever });

        const response = await axios({
            method: 'post',
            url: `${process.env.WEBHOOKP2P_URL}`, 
            data: accountSend 
        });
        if(!response) throw 'Falha ao realizar a transação.';

        return { accountSend, accountReciever, response };
    }
}

module.exports = new AccountService();