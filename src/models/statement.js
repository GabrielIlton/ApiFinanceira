const { model, Schema } = require('mongoose');

const StatementAccount = new Schema({
    amount:{
        type: Number,
        required: false,
    },
    type:{
        type: String,
        enum: ['deposit', 'withDraw']
    },
    accountId: {
        type: String,
        required: true,
    },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
)

module.exports = model('Statement', StatementAccount);