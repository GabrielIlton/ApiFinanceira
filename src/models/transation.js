const { model, Schema } = require('mongoose');

const TransactionAccount = new Schema({
    amount:{
        type: Number,
        required: false,
    },
    type:{
        type: String,
        enum: ['send', 'receive']
    },
    accountId: {
        type: String,
        required: true,
    },
    cashin: {
        type: Number,
        required: false,
    },
    chashout: {
        type: Number,
        required: false,
    },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
)

module.exports = model('Transaction', TransactionAccount);