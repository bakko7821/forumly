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
      <form onSubmit={handleSubmit} className="flex-column">
        <input
          type="text"
          placeholder="Название поста"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Текст поста"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  );
}

export default CreatePost;
