import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { upload } from "../utils/multer.js";
import authMiddleware from "../middleware/authMiddleware.js"; // JWT проверка

const router = express.Router();

// Создать пост
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    let imagePath = "";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newPost = new Post({
      title: title || "",
      content: content || "",
      image: imagePath || "",
      author: null, // временно без авторизации
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получить все посты (новые сверху)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username image followersCount ") // можно подтянуть имя/почту автора
      .sort({ createdAt: -1 }); // новые сверху
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении постов" });
  }
});

router.get("/findpost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Некорректный ID поста" });
    }

    const post = await Post.findById(id)
      .populate("author", "username image followersCount"); // <--- вот сюда populate

    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.json(post);
  } catch (err) {
    console.error("Ошибка при получении поста:", err);
    res.status(500).json({ message: "Ошибка при получении поста" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }

    const usersPosts = await Post.find({ author: new mongoose.Types.ObjectId(id)});

    if (!usersPosts || usersPosts.length === 0) {
      return res.status(404).json({ message: "Посты пользователя не найдены" });
    }

    res.json(usersPosts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при получении постов пользователя" });
  }
});


export default router;
