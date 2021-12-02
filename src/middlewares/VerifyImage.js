const { ImageRepository } = require('../repositories/index');


class VerifyImage {
    async verifyImage (req, res, next) {
        try {
            const { token } = res.auth;
            const accountVerify = await ImageRepository.findImageByIdAndDeletedFalse({ id: token.account_id });
            if(accountVerify) throw 'Só é possível ter uma imagem.';

            next();
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
};

module.exports = new VerifyImage()