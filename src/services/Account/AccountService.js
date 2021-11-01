const AccountValidator = require('../../validators/AccountValidators/Account');
const AccountRepository = require('../../repositories/Account/AccountRepository');
const jwt = require('jsonwebtoken');//*Importa o jsonwebtoken
const authConfig = require('../../config/auth');//*Importa o authConfig
const bcrypt = require('bcryptjs');//*Importa o bcryptjs
const StatementRepository = require('../../repositories/Statement/StatementRepository');
const TransactionRepository = require('../../repositories/Transaction/TransactionRepository');


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

    async deleteAccount ({ body, token }) {
        if(token.admin === true) {
            if(!body.cpf) throw 'Passe um CPF para deleção da conta.';
            const findCpf = await AccountRepository.findByDocumentCpf({ cpf: body.cpf });
            const deleteAccount = await AccountRepository.findOneAndUpadateDelete({ id: findCpf.id });
            if(!deleteAccount) throw 'Conta não existe.';
            return deleteAccount;
        }
        if(body.cpf) throw 'Você não tem acesso para deletar contas.';

        const deleteAccount = await AccountRepository.findOneAndUpadateDelete({ id: token.account_id });
        return deleteAccount;
    }

    async retrieveAccount ({ body }) { 
        await AccountValidator.retrieveAccountValidator( body );//!Validators

        const accountExists = await AccountRepository.findByDocumentCpf({ cpf: body.cpf });
        if(!accountExists) throw 'Conta não existe.';
        const accountVerify = await AccountRepository.findByAccountDeletedTrue({ cpf: body.cpf});
        if(!accountVerify) throw 'Conta já existe.';
        if(accountVerify){
            const accountRetrieve = await AccountRepository.findOneAndUpadateRetrieve({ cpf: accountVerify.cpf });
            return accountRetrieve;
        };
    }

    async depositAccount ({ body, token }) {
        await AccountValidator.depositAccountValidator( body )
        
        const createDeposit = await StatementRepository.depositCreateStatement({ deposit: body.deposit, token });
        const accountBalance = await AccountRepository.findById({ id: token.account_id });

        const total = body.deposit + accountBalance.balance; 
        const depositAccount = await AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
        const account = await AccountRepository.findById({ id: token.account_id });
        
        return account;
    }

    async withDrawAccount ({ body, token }) {
        await AccountValidator.withdrawAccountValidator(body);//!Validators
        const accountBalance = await AccountRepository.findById({ id: token.account_id });

        if(body.withDraw <= accountBalance.balance){
            await StatementRepository.withDrawCreateStatement({ withDraw: body.withDraw, token });
            const total = accountBalance.balance - body.withDraw;
            const withDrawAccount = await AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
            const account = await AccountRepository.findById({ id: token.account_id });
            return account;
        }else{
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }
    }

    async p2p ({ body, token }) {
        await AccountValidator.P2PValidator(body);//!Validators

        const accountReciever = await AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });
        const accountSend = await AccountRepository.findById({ id: token.account_id });
        
        if(!accountReciever) throw 'Conta de destinatário não existe';
        if(accountSend.balance < body.amount) throw 'Não tem saldo suficiente para a transação.';
        if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.';

        await TransactionRepository.P2Pcashout({ accountSend, amount: body.amount });

        const totalSend = accountSend.balance - body.amount;
        const accountIdSend = await AccountRepository.findByDocumentCpf({ cpf: accountSend.cpf });
        await AccountRepository.findOneAndUpdateBalance({ id: accountIdSend._id.toString(), total: totalSend });

        await TransactionRepository.P2Pcashin({ accountReciever, amount: body.amount });

        const totalReciever = body.amount + accountReciever.balance;
        const accountIdReciever = await AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });
        await AccountRepository.findOneAndUpdateBalance({ id: accountIdReciever._id.toString(), total: totalReciever });

        await StatementRepository.P2PcashoutCreate({ amount: body.amount, accountSend })
        await StatementRepository.P2PcashinCreate({ amount: body.amount, accountReciever })


        return { accountSend, accountReciever };

    }
}

module.exports = new AccountService();