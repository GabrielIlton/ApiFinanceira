const fs = require('fs');
const Repositories = require('../../repositories/index');


class ImageService {
    async uploadImage ({ token, file }) {
        const accountVerify = await Repositories.ImageRepository.findImageByIdAndDeletedFalse({ id: token.account_id });
        if(accountVerify) throw 'Só é possível ter uma imagem.';
        
        const fileBuffer = fs.readFileSync(file.path);
        const base64 = fileBuffer.toString('base64');

        const imageUpload = await Repositories.ImageRepository.createImage({ token, file, base64 })

        return imageUpload;
    }

    async deleteImage ({ token }) {
        const imageDeleted = await Repositories.ImageRepository.findByIdAndDeleteImage({ id: token.account_id });
        if(!imageDeleted) throw 'Imagem não existe.';
        return imageDeleted;
    }
}

module.exports = new ImageService()