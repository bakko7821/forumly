import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Post.css";

import arrowBackSvg from "../assets/images/arrow-back.svg";
import moreSvg from "../assets/images/more.svg";
import sendSvg from "../assets/images/send.svg";
import likeSvg from "../assets/images/like.svg";
import shareSvg from "../assets/images/share.svg";

function Post() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Загружаем пост
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

  // Загружаем комментарии
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/post/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке комментариев:", err);
      }
    };

    fetchComments();
  }, [id]);

  // Добавить комментарий
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        alert("Вы должны войти, чтобы оставлять комментарии");
        return;
      }

      await axios.post("http://localhost:5000/api/comments", {
        postId: id,
        userId: user.id,
        text: commentText,
      });

      setCommentText("");

      // обновляем список
      const res = await axios.get(`http://localhost:5000/api/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Ошибка при добавлении комментария:", err);
    }
  };

  function backButton() {
    navigate(-1);
  }

  function formatRenderDate(dateString) {
    if (!dateString) return "";

    const postDate = new Date(dateString);
    const today = new Date();

    const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffInMs = todayDay - postDay;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) return "сегодня";
    if (diffInDays === 1) return "вчера";

    return postDate.toLocaleDateString("ru-RU");
  }

  const renderDate = formatRenderDate(post?.createdAt);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser?.id || !id) return;

    const addPostToHistory = async () => {
      try {
        await axios.put(`http://localhost:5000/users/${currentUser.id}/history`, {
          postId: id,
        });
      } catch (err) {
        console.error(err);
      }
    };

    addPostToHistory();
  }, [id]);

  if (loading)
    return (
      <svg
        className="spinner"
        width="65px"
        height="65px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
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
              <p className="followersCount">
                {user ? user.followersCount : 0} подписчиков
              </p>
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
        <div className="postInfoBox">
          <button className="likesBox">
            <img src={likeSvg} alt="" />
            {post.likes}
          </button>
          <button className="shareButton">
            <img src={shareSvg} alt="" />
            Share
          </button>
        </div>
        <div className="postComments flex-column">
          <p className="boxName">Комментарии</p>

          {/* форма для комментариев */}
          <form onSubmit={handleCommentSubmit} className="sendCommentForm flex-center">
            <div className="floating-input">
              <input
                type="text"
                id="comment"
                name="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Оставьте комментарий..."
                required
              />
              <label htmlFor="comment">Оставить комментарий</label>
            </div>
            <button type="submit" className="sendCommentButton flex-center">
              <img src={sendSvg} alt="Отправить" />
            </button>
          </form>

          {/* список комментариев */}
          <div className="commentsList flex-column">
            {comments.length === 0 ? (
              <p className="noCommentsText">Комментариев пока нет. Оставьте след в истории!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="commentItem flex-column">
                  <div className="commentUser flex-center">
                    {comment.userId?.image ? (
                      <img
                        className="userAvatar"
                        src={`http://localhost:5000${comment.userId.image}`}
                        alt="avatar"
                      />
                    ) : (
                      <div className="userAvatar flex-center">
                        <p>{comment.userId?.username?.charAt(0) || "?"}</p>
                      </div>
                    )}
                    <p className="usernameText">{comment.userId?.username || "Аноним"}</p>
                    <div className="circle"></div>
                    <p className="commentDate">{formatRenderDate(comment.createdAt)}</p>
                  </div>
                  <p className="commentText">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
