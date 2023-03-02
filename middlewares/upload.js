const multer = require("multer");
const path = require("path");
const tempoDir = path.join(__dirname, "../", "temp");
const multerConfig = multer.diskStorage({
  destination: tempoDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    FileSize: 100,
  },
});
const upload = multer({
  storage: multerConfig,
});
module.exports = upload;
