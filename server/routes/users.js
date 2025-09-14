import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Получить ТОП пользователей по количеству подписчиков
router.get("/popular", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ followersCount: -1 }) // сортировка по убыванию
      .limit(10)                    // только топ-10
      .select("username followersCount"); // возвращаем только нужные поля

    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении популярных пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
