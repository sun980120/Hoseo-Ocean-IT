var multer = require('multer'); // 1

const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(1)
        cb(null, 'public/images/users')
    },
    filename: function (req, file, cb) {
        console.log(2)
        cb(null, file.originalname)
    }
})

const storageBoard = multer.diskStorage({ // 2
    destination(req, file, cb) {
        cb(null, 'public/images/board');
    },
    filename(req, file, cb) {
        console.log(file)
        cb(null, `${Date.now()}__${file.originalname}`);
    },
});

const uploadBoard = multer({ storage: storageBoard });

const uploadUser = multer({ storage: storageUser })

module.exports = {
    uploadUser,
    uploadBoard,
}