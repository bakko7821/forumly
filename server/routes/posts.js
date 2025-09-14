import express from "express";
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
      .populate("author", "username") // можно подтянуть имя/почту автора
      .sort({ createdAt: -1 }); // новые сверху
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении постов" });
  }
});

export default router;
