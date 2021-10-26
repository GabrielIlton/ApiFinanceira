const Multer = require('multer');
const Path = require('path');
const Crypto = require('crypto');

const multerConfig = {
  dest: Path.resolve(__dirname, '..', '..', 'tmp'),
  storage: Multer.diskStorage({
    destination: (req, file, cb) =>
      cb(null, Path.resolve(__dirname, '..', '..', 'tmp')),
    filename: (req, file, cb) => {
      Crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, file.key);
      });
    },
  }),
};

module.exports = multerConfig;