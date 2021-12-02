function validateEmail(email) {
    const validator = /\S+@\S+\.\S+/;
    return validator.test(email);
};

class AccountValidator {   
    async accountCreateValidator(body) {         
        if(!body.email) throw 'Email é obrigatório.';
        if(!validateEmail(body.email)) throw 'Email deve ter uma estrutura adequada, como por exemplo "karrlus@gmail.com".'
        if(!body.name) throw 'Nome é obrigatório.';
        if(!body.cpf) throw 'CPF é obrigatório.';
        if(String(body.cpf).length != 11) throw 'CPF deve ser igual a 11 caracteres.';
        if(!body.address) throw 'Endereco é obrigatório.';
        if(!body.phone) throw 'Número de telefone é obrigatório juntamente com o DDD.';
        if(String(body.phone).length != 11) throw 'A quantidade de números de telefone deve ser igual a 11.';
        if(!body.password) throw 'Senha é obrigatória.';
        if(body.password.length != 6 ) throw 'Senha deve conter 6 caracteres.';
    };

    async updatePasswordAccountValidator(body) {
        if(!body.passwordOld) throw 'Senha antiga é obrigatória.';
        if(!body.email) throw 'Email é obrigatório.';
        if(!body.passwordNew) throw 'Senha nova é obrigatória.';
        if(body.passwordNew.length != 6) throw 'Senha conter 6 caracteres.';
    };

    async loginValidator(body) {
        if(!body.email) throw 'Email é obrigatório.';
        if(!body.password) throw 'Senha é obrigatória.';
    };

    async passwordSecurityValidator(body) {
        if(!body.passwordSecurity) throw 'Senha de segurança é obrigatória.';
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
        if(body.withDraw < 1) throw 'O valor do saque é obrigatório e deve ser maior ou igual a R$1.';
    };

    async P2PValidator(body){
        if(!body.cpfReciever) throw 'CPF do recebedor é obrigatório.';
        if(!body.amount) throw 'O valor da transferência é obrigatório.';
    };
}

module.exports = new AccountValidator()