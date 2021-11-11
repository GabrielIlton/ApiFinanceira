const { model, Schema } = require('mongoose');

const TransactionAccount = new Schema({
    amount:{
        type: Number,
        required: false,
    },
    type:{
        type: String,
        enum: ['cashout', 'cashin', 'cashoutSecurity', 'cashinSecurity']
    },
    accountId: {
        type: String,
        required: true,
    },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

module.exports = model('Transaction', TransactionAccount);