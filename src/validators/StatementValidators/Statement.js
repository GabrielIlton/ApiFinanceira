const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb

function validateEmail(email) {
    const validator = /\S+@\S+\.\S+/;
    return validator.test(email);
};

class StatementValidator {
    async satatementByDateValidator(query) {         
        if(!query.startDate) throw 'Data de início da pesquisa é obrigatória.';
        if(!query.endDate) throw 'Data final da pesquisa é obrigatória.';
    };
}

module.exports = new StatementValidator()