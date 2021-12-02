class StatementValidator {
    async statementByDateValidator(query) {         
        if(Object.values(query).length == 0) throw 'É preciso ter as data de início e de fim para a pesquisa.';
        if(!query.startDate) throw 'Data de início da pesquisa é obrigatória.';
        if(!query.endDate) throw 'Data final da pesquisa é obrigatória.';
    };
}

module.exports = new StatementValidator()