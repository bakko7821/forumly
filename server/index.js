import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected!"))
.catch((err) => console.error(err));

app.get("/", (req, res) => {
    res.send("API worked 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";

app.use("/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/uploads", express.static("uploads"));
