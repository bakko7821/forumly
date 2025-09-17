import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Post.css";

import arrowBackSvg from "../assets/images/arrow-back.svg";
import moreSvg from "../assets/images/more.svg";
import sendSvg from "../assets/images/send.svg";

function Post() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Загружаем сам пост
  useEffect(() => {
    if (!id) {
      setError("ID поста отсутствует");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/findpost/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке поста:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке поста");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Загружаем автора поста
  useEffect(() => {
    if (!post || !post.author) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${post.author}`);
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке профиля");
      }
    };

    fetchUser();
  }, [post]);

  function backButton() {
    navigate(-1);
  }

  if (loading) return (
    <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle
        className="path"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      ></circle>
    </svg>

  );
  if (error) return <p className="text-red-600">{error}</p>;

  function formatRenderDate(dateString) {
      if (!dateString) return "";

      const postDate = new Date(dateString);
      const today = new Date();

      // убираем время, оставляем только дату
      const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
      const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffInMs = todayDay - postDay;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 0) return "сегодня";
      if (diffInDays === 1) return "вчера";

      return postDate.toLocaleDateString("ru-RU");
  }

  const renderDate = formatRenderDate(post?.createdAt);
  
  return (
    <div className="postPage">
      <button className="backButton flex-center" onClick={backButton}>
        <img src={arrowBackSvg} alt="Назад" />
      </button>

      <div className="postContent flex-column">
        <div className="topBox flex-between">
          <div className="userInfo flex-center">
            {user ? (
              user.image && user.image.trim() !== "" ? (
                <img
                  className="userAvatar"
                  src={`http://localhost:5000${user.image}`}
                  alt="avatar"
                />
              ) : (
                <div className="userAvatar flex-center">
                  <p>{user.username.charAt(0)}</p>
                </div>
              )
            ) : (
              <div className="userAvatar flex-center">
                <p>?</p>
              </div>
            )}
            <div className="userTextInfo flex-column">
              <div className="headingText flex-center">
                <p className="userName">{user ? user.username : "Неизвестно"}</p>
                <div className="circle"></div>
                <p className="postDate">{renderDate}</p>
              </div>
              <p className="followersCount">{user ? user.followersCount : 0} подписчиков</p>
            </div>
          </div>
          <button className="moreButton">
            <img src={moreSvg} alt="Ещё" />
          </button>
        </div>
        <div className="postBody flex-column">
          <p className="postTitle">{post.title}</p>
          <p className="postText">{post.text}</p>
        </div>
        <div className="postComments flex-column">
            <p className="boxName">Комментарии</p>
            <form action="submit" className="sendCommentForm">
                <input 
                className="sendCommentInput"
                type="text" 
                placeholder="Поделитесь своим мнением"/>
                <button type="submit" className="sendCommentButton flex-center">
                    <img src={sendSvg} alt="" />
                </button>
            </form>
            <div className="commentsList">

            </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
