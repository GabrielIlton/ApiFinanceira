const { model, Schema } = require('mongoose');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const ImageSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    size: { 
        type: Number, 
        required: true 
    },
    key: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String, 
        required: false,  
    },
    base64: { 
        type: String, 
        required: true
    },
    accountId: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

ImageSchema.pre('save', async function(next){  
    if(!this.url || this.url) {
        this.url = `http://localhost:3333/image/${this.key}`
    }
    next()
});
ImageSchema.pre("updateOne", async function(next){
    promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', this.url));
    next();
});



module.exports = model('Image', ImageSchema);