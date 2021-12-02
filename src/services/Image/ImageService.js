const fs = require('fs');
const { ImageRepository } = require('../../repositories/index');
const { ImageValidators } = require('../../validators/index');


class ImageService {
    async uploadImage ({ token, file }) {
        await ImageValidators.fileImageValidator({ body: file });
        const accountVerify = await ImageRepository.findImageByIdAndDeletedFalse({ id: token.account_id });
        if(accountVerify) throw 'Só é possível ter uma imagem.';
        
        const fileBuffer = fs.readFileSync(file.path);
        const base64 = fileBuffer.toString('base64');

        const imageUpload = await ImageRepository.createImage({ token, file, base64 })

        return imageUpload;
    };

    async deleteImage ({ token }) {
        const imageDeleted = await ImageRepository.findByIdAndDeleteImage({ id: token.account_id });
        if(!imageDeleted) throw 'Imagem não existe.';
        return imageDeleted;
    };
}

module.exports = new ImageService()