const Models = require('../../models/index');//*Importa a collection de models


class ImageRepository {
    async findImageByIdAndDeletedFalse ({ id }) {
        return await Models.ImageModel.findOne({ accountId: id, deleted: false });
    }
    
    async findByIdAndDeleteImage ({ id }) {
        return await Models.ImageModel.findOneAndUpdate({ accountId: id, deleted: false }, { deleted: true })
    }

    async createImage ({ file, token, base64 }) {
        const imageUpload = await Models.ImageModel.create({
            name: file.originalname, 
            size: file.size, 
            key: file.key, 
            url: "",
            base64,
            accountId: token.account_id,
            deleted: false
        });
        return imageUpload;
    }
}

module.exports = new ImageRepository()