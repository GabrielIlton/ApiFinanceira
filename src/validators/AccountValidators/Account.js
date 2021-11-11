function validateEmail(email) {
    const validator = /\S+@\S+\.\S+/;
    return validator.test(email);
};

class AccountValidator {   
    async accountCreateValidator(body) {         
        if(!validateEmail(body.email)) throw 'Email deve ter uma estrutura adequada, como por exemplo "karrlus@gmail.com".'
        if(!body.name) throw 'Nome é obrigatório.';
        if(!body.cpf) throw 'CPF é obrigatório.';
        if(String(body.cpf).length != 11) throw 'CPF deve ser igual a 11 caracteres.';
        if(!body.endereco) throw 'Endereco é obrigatório.';
        if(!body.telefone) throw 'Número de telefone é obrigatório juntamente com o DDD.';
        if(String(body.telefone).length != 11) throw 'A quantidade de números de telefone deve ser igual a 11.';
        if(!body.email) throw 'Email é obrigatório.';
        if(!body.password) throw 'Senha é obrigatória.';
        if(body.password.length != 6 ) throw 'Senha deve conter 6 caracteres.';
    };

    async updatePasswordAccountValidator(body) {
        if(!body.passwordOld) throw 'Senha antiga é obrigatória.';
        if(!body.email) throw 'Email é obrigatório.';
        if(!body.passwordNew) throw 'Senha nova é obrigatória.';
        if(body.passwordNew.length != 6) throw 'Senha conter 6 caracteres.';
    };

    async loginSecurity(body) {
        if(!body.passwordSecurity) throw 'Senha de segurança é obrigatória.';
        if(!body.valueSecurity) throw 'Valor de segurança é obrigatório.';
        if(body.passwordSecurity.length != 6 ) throw 'Senha deve conter 6 caracteres.';
    };

    async deleteAccountValidator(body) {
        if(!body.cpf) throw 'Passe um CPF para deleção da conta.';
    };

    async retrieveAccountValidator(body) {
        if(!body.cpf) throw 'CPF é obrigatório.';
    };

    async depositAccountValidator(body) {
        if(!body.deposit) throw 'O valor do depósito é obrigatório.';
    };

    async withdrawAccountValidator(body) {
        if(body.withdraw < 1) throw 'O valor do saque é obrigatório.';
    };

    async P2PValidator(body){
        if(!body.cpfReciever) throw 'CPF do recebedor é obrigatório.';
        if(!body.amount) throw 'O valor da transferência é obrigatório.';
    };
}

module.exports = new AccountValidator()