const ImageModel = require('../models/imageUpload');//*Importa a collection de models
const fs = require('fs');

class UploadImage {
    async uploadImage(req, res){
        try {
            const { token } = res.auth;
            const { file } = req;
            
            const accountVerify = await ImageModel.findOne({ accountId: token.account_id, deleted: false });
            if(accountVerify) throw 'Só é possível ter uma imagem.';
            
            const fileBuffer = fs.readFileSync(file.path);
            const base64 = fileBuffer.toString('base64');

            const imageUpload = await ImageModel.create({
                name: file.originalname, 
                size: file.size, 
                key: file.key, 
                url: "",
                base64: base64,
                accountId: token.account_id,
                deleted: false
        
            });
            return res.status(200).json({ name: imageUpload.name, size: imageUpload.size });

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error });   
        }
    };

    async deleteImage(req, res){
        try {
            const { token } = res.auth;
            
            const imageDelete = await ImageModel.findOneAndUpdate({ _id: token.account_id, deleted: false }, { deleted: true });
            if(!imageDelete) throw 'Imagem não existe.';

            return res.status(200).json({ message: 'Deletado com sucesso.' });
        } catch (error) {
            return res.status(400).json({ error })
        }
    };
}

module.exports = new UploadImage();