import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("text"); // "text" или "image"
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  // Отправка поста
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Вы не авторизованы! Сначала войдите.");
        return;
      }

      if (contentType === "text") {
        // Отправка текстового поста через JSON
        await axios.post(
          "http://localhost:5000/posts",
          { title, content: text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else if (contentType === "image" && imageFile) {
        // Отправка изображения через FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", imageFile);

        await axios.post("http://localhost:5000/posts", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        alert("Выберите изображение!");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
      alert("Ошибка при создании поста. Проверьте консоль.");
    }
  };

  // Обработка выбора файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="createPostPage flex-column">
        <p className="titleText">Create Post</p>

        {/* Кнопки переключения типа контента */}
        <div className="buttonsBox">
          <button
            type="button"
            id={contentType === "text" ? "active" : ""}
            onClick={() => setContentType("text")}
          >
            Text
          </button>
          <button
            type="button"
            id={contentType === "image" ? "active" : ""}
            onClick={() => setContentType("image")}
          >
            Image
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="flex-column flex-center">
          {/* Заголовок */}
          <div className="floating-input">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок"
              required
            />
            <label htmlFor="title">Заголовок</label>
          </div>

          {/* Контент */}
          {contentType === "text" ? (
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
          ) : (
            <div className="avatarForm">
              <label className="fileLabel">
                <input type="file" className="fileInput" onChange={handleFileChange} />
                Выберите файл
              </label>
              <p className="fileHint">Поддерживаются форматы: jpg, png</p>

              {imagePreview && (
                <div className="imagePreview">
                  <img src={imagePreview} alt="preview" />
                </div>
              )}
            </div>
          )}

          <button type="submit">Create post</button>
        </form>
      </div>
      <div className="postRulesBox"></div>
    </>
  );
}

export default CreatePost;
