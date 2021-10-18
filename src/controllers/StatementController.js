const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const StatementModel = require('../models/statement');
// const AccountModel = require('../models/account');//*Importa a collection de models
// const authConfig = require('../config/auth');//*Importa o authConfig

class StatementController {//*É uma classe que contem o estrato bancario 
    async listAllStatement (req, res) {
        try {
            const statement = await StatementModel.find({});//*Encontra o ID do cpf em account e depois encontra o mesmo Id no statement
            return res.status(200).json({ statement });
          
        } catch (error) {
            return res.status(404).json({message: error.message});
        };
    };
    
    async listOneAccountStatement (req, res) {
        try {
            const { id } = res.auth;
            const statement = await StatementModel.find({ accountId: id.account_id });//*Encontra o ID do cpf em account e depois encontra o mesmo Id no statement
            return res.status(200).json({ statement });
          
        } catch (error) {
            return res.status(404).json({message: error.message});
        };
    };

   async statementByDate (req, res) {     
        try {
            const { startDate, endDate } = req.query;
            const { id } = res.auth;
            const condition = {
                accountId: id.account_id,  created_at: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }; 
            const statement = await StatementModel.find(condition);//*Encontra o ID do cpf em account e depois encontra o mesmo Id no statement    
            if(statement.length === 0) throw "Não há nenhuma transação nesse período de tempo."
            return res.status(200).json({statement});
            
        } catch (error) {
            return res.status(404).json({message: error});
        };
    };
}

module.exports = new StatementController();//?Exporta o statement controller