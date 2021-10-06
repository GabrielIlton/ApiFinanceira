const { model, Schema } = require('mongoose');

const AccountSchema = new Schema({
     name: {
          type: String,
          required: true,
     },
     cpf: {
          type: Number,
          required: true,  
     },
     endereco: new Schema ({
          rua:{ type: String, required: true },
          bairro: { type: String, required: true },
          numero: { type: Number, required: true },
     }),
     telefone:{
          type: Number,
          required: true,
     },
     deleted: { 
          type: Boolean, 
          default: false
     },
     balance: {
          type: Number,
          default: 0
     }    
});

module.exports = model('Account', AccountSchema);//*Envia pro banco