const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');


const AccountSchema = new Schema({
     name: {
          type: String,
          required: true,
     },
     cpf: {
          type: Number,
          unique: true,
          required: true,  
     },
     email: {
          type: String,
          unique: true,
          required: true,
          lowercase: true,
     },
     password: {
          type: String,
          required: true
     },
     passwordSecurity: {
          type: String,
          required: false,
          default: ""
     },
     balanceSecurity: {
          type: Number,
          required: false,
          default: 0
     },
     address: new Schema ({
          street:{ type: String, required: true },
          quarter: { type: String, required: true },
          number: { type: Number, required: true },
     }),
     phone:{
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
     },
     admin: {
          type: Boolean,
          default: false,
          required: false
     }
});

AccountSchema.pre('save', async function(next){
     const hash = await bcrypt.hash(this.password, 10);
     this.password = hash;    
     next();
});


module.exports = model('Account', AccountSchema);