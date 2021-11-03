class StatementValidator {
    async statementByDateValidator(query) {         
        if(!query.startDate) throw 'Data de início da pesquisa é obrigatória.';
        if(!query.endDate) throw 'Data final da pesquisa é obrigatória.';
    };
}

module.exports = new StatementValidator()