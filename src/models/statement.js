const { model, Schema } = require('mongoose');

const StatementAccount = new Schema({
    amount:{
        type: Number,
        required: false,
    },
    type:{
        type: String,
        enum: ['deposit', 'withDraw', 'cashoutP2P', 'cashinP2P', "cashoutP2PSecurity", "cashinP2PSecurity"]
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