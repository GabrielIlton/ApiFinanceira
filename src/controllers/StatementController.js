const mongoose = require('mongoose');//*Importa o mongoose
mongoose.connect('mongodb://localhost:27017/apiFinanceira');//*Conecta o mongoose com o mongodb
const AccountModel = require('../models/account');//*Importa a collection de models
const StatementModel = require('../models/statement');


class StatementController {//*É uma classe que contem o estrato bancario 
    async listStatement (req, res) {
        try {
            const statement = await StatementModel.find({});//*Encontra o ID do cpf em account e depois encontra o mesmo Id no statement
            return res.status(200).json({ statement });
          
        } catch (error) {
            return res.status(404).json({message: error.message});
        };
    };

   async statementByDate (req, res) {     
        try {
            const { startDate, endDate } = req.query;
            const { accountId } = res;
            const condition = {
                accountId,  created_at: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }; 
            const statement = await StatementModel.find(condition);//*Encontra o ID do cpf em account e depois encontra o mesmo Id no statement    
            return res.status(200).json({statement});
            
        } catch (error) {
            return res.status(404).json({message: error.message});
        };
    };
}

module.exports = new StatementController();//?Exporta o statement controller