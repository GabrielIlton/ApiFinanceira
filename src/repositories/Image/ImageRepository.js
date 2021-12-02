const { ImageModel } = require('../../models/index');


class ImageRepository {
    async findImageByIdAndDeletedFalse ({ id }) {
        return await ImageModel.findOne({ accountId: id, deleted: false });
    };
    
    async findByIdAndDeleteImage ({ id }) {
        return await ImageModel.findOneAndUpdate({ accountId: id, deleted: false }, { deleted: true })
    };

    async createImage ({ file, token, base64 }) {
        const imageUpload = await ImageModel.create({
            name: file.originalname, 
            size: file.size, 
            key: file.key, 
            url: "",
            base64,
            accountId: token.account_id,
            deleted: false
        });
        return imageUpload;
    };
}

module.exports = new ImageRepository()