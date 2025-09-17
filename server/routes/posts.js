import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js"; // JWT проверка

const router = express.Router();

// Создать пост
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, text } = req.body;
    const newPost = new Post({
      title,
      text,
      author: req.user.id, // берём ID из токена
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании поста" });
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

router.get("/findpost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Некорректный ID поста" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.json(post);
  } catch (err) {
    console.error("Ошибка при получении поста:", err);
    res.status(500).json({ message: "Ошибка при получении поста" });
  }
});



export default router;
