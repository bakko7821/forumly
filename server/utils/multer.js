import multer from "multer";
import path from "path";

// Настройка хранилища
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // создайте папку uploads в проекте
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // уникальное имя
  },
});

export const upload = multer({ storage });
