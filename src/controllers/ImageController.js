const ImageService = require('../services/UploadImage/ImageService');

class Image {
    async uploadImage(req, res){
        try {
            const { token } = res.auth;

            const imageUpload = await ImageService.uploadImage({ token, file: req.file })
       
            return res.status(200).json({ name: imageUpload.name, size: imageUpload.size });

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error });   
        }
    };

    async deleteImage(req, res){
        try {
            const { token } = res.auth;
            
            const imageDeleted = await ImageService.deleteImage({ token })

            return res.status(200).json({ message: 'Sua imagem foi deletada com sucesso.' });
        } catch (error) {
            return res.status(400).json({ error })
        }
    };
}

module.exports = new Image();