const { AccountValidators } = require('../../validators/index');
const jwt = require('jsonwebtoken');//*Importa o jsonwebtoken
const authConfig = require('../../config/auth');//*Importa o authConfig
const bcrypt = require('bcryptjs');//*Importa o bcryptjs
const Repositories = require('../../repositories/index');
const axios = require('axios');


class AccountService {
    async createAccount ({ body }) { 
        await AccountValidators.accountCreateValidator(body);

        const accountVerifyCpf = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf })
        const accountVerifyEmail = await Repositories.AccountRepository.findByDocumentEmail({ email: body.email });
        if(accountVerifyCpf || accountVerifyEmail) throw 'CPF ou email já existente.';

        return await Repositories.AccountRepository.createAccount({ body }) 
    };

    async loginAccount ({ account }) {
        const formatedEmail = account.email.toLowerCase();
        const token = jwt.sign({
            account_id: account._id,
            email: formatedEmail,
            password: account.password,
            passwordSecurity: account.passwordSecurity,
            admin: account.admin,
        }, 
            authConfig.secret, 
        {
            expiresIn: authConfig.expires
        });
        return token;
    };

    async getAccountDetails ({ token }) {
        return await Repositories.AccountRepository.findById({ id: token.account_id });
    };

    async getSaldo ({ token }) {
        const account = await Repositories.AccountRepository.findById({ id: token.account_id }); 
        if(token.password) {
            return { account, balance: account.balance };
        } else {
            const integerBalance = parseFloat(account.balanceSecurity.toPrecision(5));
            return { account, balance: integerBalance };
        }  
    };

    async getAccounts ({ token }) {
        const accountAdminTrue = await Repositories.AccountRepository.findByAdmin({ id: token.account_id });
        if(!accountAdminTrue) throw 'Você não tem acesso a essa rota.';
        const allAccounts = await Repositories.AccountRepository.findAllAccounts({ });
        return allAccounts;
    };

    async accountPasswordSecurity ({ token, body }) {
        if(token.passwordSecurity) throw 'Não foi possível acessar esse comando.';
        await AccountValidators.passwordSecurityValidator(body);
        const account = await Repositories.AccountRepository.findById({ id: token.account_id });
        if(!account.passwordSecurity == "") throw 'Você já possui uma senha de segurança.'; 
        const passwordSecurity = await bcrypt.hash(body.passwordSecurity, 10);
        const createPasswordSecurity = await Repositories.AccountRepository.createPasswordSecurity({ id: account._id, passwordSecurity });
        
        return createPasswordSecurity;
    };

    async updatePasswordAccount ({ body, token }) {
        if(token.passwordSecurity) throw 'Não é possível alterar senha.';

        await AccountValidators.updatePasswordAccountValidator( body );

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
    };

    async deleteAccount ({ body, token }) {
        if(token.passwordSecurity) {
            const messageFake = 'Deletado com sucesso' 
            return messageFake;
        };

        if(token.admin === true) {
            await AccountValidators.deleteAccountValidator( body );
            const findByCpf = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf });
            if(!findByCpf) throw 'Conta não existe.';
            const deleteAccount = await Repositories.AccountRepository.findOneAndUpadateDelete({ id: findByCpf.id });
            if(!deleteAccount) throw 'Conta já deletada.' 
            return deleteAccount;
        }
        if(body.cpf) throw 'Você não tem acesso para deletar contas.';

        const deleteAccount = await Repositories.AccountRepository.findOneAndUpadateDelete({ id: token.account_id });
        return deleteAccount;
    };

    async retrieveAccount ({ body }) { 
        await AccountValidators.retrieveAccountValidator( body );

        const accountExists = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpf });
        if(!accountExists) throw 'Conta não existe.';
        const accountVerify = await Repositories.AccountRepository.findByAccountDeletedTrue({ cpf: body.cpf});
        if(!accountVerify) throw 'Conta já existe.';
        if(accountVerify){
            const accountRetrieve = await Repositories.AccountRepository.findOneAndUpadateRetrieve({ cpf: accountVerify.cpf });
            return accountRetrieve;
        };
    };

    async depositAccount ({ body, token }) {
        await AccountValidators.depositAccountValidator( body )
        
        await Repositories.StatementRepository.depositCreateStatement({ deposit: body.deposit, token });
        const accountBalance = await Repositories.AccountRepository.findById({ id: token.account_id });

        const total = body.deposit + accountBalance.balance; 
        await Repositories.AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
        const account = await Repositories.AccountRepository.findById({ id: token.account_id });
        
        return account;
    };

    async withDrawAccount ({ body, token }) {
        if(token.password){
            await AccountValidators.withdrawAccountValidator(body);
            const account = await Repositories.AccountRepository.findById({ id: token.account_id });

            if(body.withDraw <= account.balance){
                await Repositories.StatementRepository.withDrawCreateStatement({ withDraw: body.withDraw, token });
                const total = account.balance - body.withDraw;
                await Repositories.AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
                parseFloat(account.balance.toFixed(2))
                return { account, balance: account.balance };
            } else{
                throw "Saldo insuficiente.";
            };
        };

        if(token.passwordSecurity){
            await AccountValidators.withdrawAccountValidator(body);
            const account = await Repositories.AccountRepository.findById({ id: token.account_id });

            if(body.withDraw <= account.balanceSecurity){
                const balanceSecurity = account.balanceSecurity - body.withDraw;
                await Repositories.AccountRepository.updateBalanceSecurity({ id: account._id, balanceSecurity }); 
                await Repositories.StatementRepository.withDrawCreateStatementSecurity({ withDraw: body.withDraw, token });
                const total = account.balance - body.withDraw;
                const integerBalance = parseFloat(account.balanceSecurity.toPrecision(5));
                await Repositories.AccountRepository.findOneAndUpdateBalance({ id: token.account_id, total });
               
                return { account, balance: integerBalance };
            } else{
                throw 'Saldo insuficiente.';
            };
        };
    };

    async p2p ({ body, token }) {
        await AccountValidators.P2PValidator(body);

        if(token.password){
            const accountReciever = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });
            const accountSend = await Repositories.AccountRepository.findById({ id: token.account_id });
            
            if(!accountReciever) throw 'Conta de destinatário não existe';
            if(accountSend.balance < body.amount) throw 'Não tem saldo suficiente para a transação.';
            if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.';
    
            await Repositories.TransactionRepository.P2Pcashout({ accountSend, amount: body.amount });
    
            const totalSend = accountSend.balance - body.amount;
    
            await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountSend._id.toString(), total: totalSend });
            await Repositories.TransactionRepository.P2Pcashin({ accountReciever, amount: body.amount });
    
            const totalReciever = body.amount + accountReciever.balance;
    
            await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountReciever._id.toString(), total: totalReciever });
            await Repositories.StatementRepository.P2PcashoutCreate({ amount: body.amount, accountSend });
            await Repositories.StatementRepository.P2PcashinCreate({ amount: body.amount, accountReciever });

            const response = await axios({
                method: 'post',
                url: `${process.env.WEBHOOKP2P_URL}`, 
                data: accountSend 
            });
            if(!response) throw 'Falha ao enviar mensagem da transação realizada com sucesso.';
    
            return { accountSend, accountReciever, response, balance: accountSend.balance };
        };

        if(token.passwordSecurity){
            const accountReciever = await Repositories.AccountRepository.findByDocumentCpf({ cpf: body.cpfReciever });
            const accountSend = await Repositories.AccountRepository.findById({ id: token.account_id });

            if(!accountReciever) throw 'Conta de destinatário não existe';
            if(accountSend.balanceSecurity < body.amount) throw 'Não tem saldo suficiente para a transação.';
            if(body.amount > accountSend.balance) throw 'Não tem saldo suficiente para a transação.';
            if(token.account_id === accountReciever.id) throw 'Não pode fazer a transferência para si mesmo.';
            
            const balanceSecurity = accountSend.balanceSecurity - body.amount;
            await Repositories.AccountRepository.updateBalanceSecurity({ id: accountSend._id, balanceSecurity });

            await Repositories.TransactionRepository.P2PcashoutSecurity({ accountSend, amount: body.amount });

            const totalSend = accountSend.balance - body.amount;

            await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountSend._id.toString(), total: totalSend });
            await Repositories.TransactionRepository.P2PcashinSecurity({ accountReciever, amount: body.amount });

            const totalReciever = body.amount + accountReciever.balance;

            await Repositories.AccountRepository.findOneAndUpdateBalance({ id: accountReciever._id.toString(), total: totalReciever });
            await Repositories.StatementRepository.P2PcashoutSecurity({ amount: body.amount, accountSend });
            await Repositories.StatementRepository.P2PcashinSecurity({ amount: body.amount, accountReciever });

            const response = await axios({
                method: 'post',
                url: `${process.env.WEBHOOKP2P_URL}`, 
                data: accountSend 
            });
            if(!response) throw 'Falha ao enviar mensagem da transação realizada com sucesso.';
    
            return { accountSend, accountReciever, response, balance: balanceSecurity };
        };
    };
}

module.exports = new AccountService();