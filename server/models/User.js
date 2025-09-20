import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, unique: false },
  lastname: { type: String, required: true, unique: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followersCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, default: "" },

  history: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      }
    ],
    default: []
  },
  favorite: {
    type: [
      {
        userId: { type: String, required: true }, // или mongoose.Schema.Types.ObjectId, если посты в Mongo
        date: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
});

const User = mongoose.model("User", userSchema);
export default User;
