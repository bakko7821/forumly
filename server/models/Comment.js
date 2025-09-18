import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // автоматически создаст createdAt и updatedAt
);

export default mongoose.model("Comment", commentSchema);
