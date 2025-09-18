import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css"

function CreatePost() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/posts",
        { title, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/"); // после успешной отправки → домой
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    }
  };

  return (
    <div className="createPostPage flex-center flex-column">
      <p>Создать пост</p>
      <form onSubmit={handleSubmit} className="flex-column flex-center">
        {/* Email */}
        <div className="floating-input">
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название поста"
            required
          />
          <label htmlFor="title">Название поста</label>
        </div>

        {/* Password */}
        <div className="floating-input">
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Текст поста"
            required
          />
          <label htmlFor="text">Текст поста</label>
        </div>
        <button type="submit">Поделиться мнением</button>
      </form>
    </div>
  );
}

export default CreatePost;
