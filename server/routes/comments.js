import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// Добавить комментарий
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении комментария" });
  }
});

// Получить комментарии по посту
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username image");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке комментариев" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.params.userId })
      .populate("postId")  // подтянет весь документ Post
      .populate("userId"); // подтянет весь документ User

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "Комментарии пользователя не найдены" });
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при загрузке комментариев" });
  }
});


export default router;
