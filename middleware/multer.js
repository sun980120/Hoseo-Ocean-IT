const multer = require('multer');

const forPatent = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/patent');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const forTreatise = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/treatise');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const forAnnouncement = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/announcement');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const uploadPatent = multer({ storage: forPatent });
const uploadTreatise = multer({ storage: forTreatise })
const uploadAnnouncement = multer({ storage: forAnnouncement });

module.exports = {
    uploadPatent,
    uploadTreatise,
    uploadAnnouncement,
};