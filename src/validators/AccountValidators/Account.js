const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/apiFinanceira');


function validateEmail(email) {
    const validator = /\S+@\S+\.\S+/;
    return validator.test(email);
};

class AccountValidator {   
    async accountCreateValidator(body) {         
        if(!validateEmail(body.email)) throw 'Email deve ter uma estrutura adequada, como por exemplo "karrlus@gmail.com".'
        if(!body.name) throw 'Nome é obrigatório.';//*Verifica se nome exixte
        if(!body.cpf) throw 'CPF é obrigatório.';//*Verifica se cpf existe
        if(String(body.cpf).length != 11) throw 'CPF deve ser igual a 11 caracteres.';//*Verifica se cpf existe
        if(!body.endereco) throw 'Endereco é obrigatório.';//*Verifica se endereço existe
        if(!body.telefone) throw 'Número de telefone é obrigatório juntamente com o DDD.';//*Verifica se telefone existe
        if(String(body.telefone).length != 11) throw 'A quantidade de números de telefone deve ser igual a 11.';//*Verifica se telefone existe
        if(!body.email) throw 'Email é obrigatório.';//*Verifica se email existe
        if(!body.password) throw 'Senha é obrigatória.';//*Verifica se senha existe
        if(body.password.length < 4 ) throw 'Senha deve conter mais de 4 caracteres.';//*Verifica se senha existe
    };

    async updatePasswordAccountValidator(body) {
        if(!body.passwordOld) throw 'Senha antiga é obrigatória.';
        if(!body.email) throw 'Email é obrigatório.';
        if(!body.passwordNew) throw 'Senha nova é obrigatória.';
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