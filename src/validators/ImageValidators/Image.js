class ImageValidator {
    async fileImageValidator({ body }) {         
        if(!body) throw 'Imagem é obrigatória.';
    };
}

module.exports = new ImageValidator()