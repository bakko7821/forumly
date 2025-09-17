import express from "express";
import User from "../models/User.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// Получить ТОП пользователей по количеству подписчиков
router.get("/popular", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ followersCount: -1 })
      .limit(10)

    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении популярных пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


import mongoose from "mongoose";

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }

    const user = await User.findById(id)

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.json(user);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, username } = req.body;

    const updateData = { firstname, lastname, username };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`; // путь к файлу
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "Пользователь не найден" });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


export default router;
