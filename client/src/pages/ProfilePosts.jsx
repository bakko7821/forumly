import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import shareSvg from "../assets/images/share.svg";

function ProfilePosts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  // Загружаем посты пользователя
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]));
  }, [id]);

  // Загружаем данные пользователя
  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [id]);

  // Функция перехода на страницу поста
  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  // Форматирование даты
  function formatRenderDate(dateString) {
    if (!dateString) return "";

    const userDate = new Date(dateString);
    const today = new Date();

    const postDay = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffInMs = todayDay - postDay;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) return "Сегодня";
    if (diffInDays === 1) return "Вчера";

    return userDate.toLocaleDateString("ru-RU");
  }

  return (
    <div className="postsListBox flex-column">
      <div className="postList flex-column">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="postCard flex-column" onClick={() => goToPost(post._id)}>
              <div className="postHeadingInfo flex-between">
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
                  <p className="userName">{user?.username || "Неизвестно"}</p>
                  <div className="circle"></div>
                  <p className="postTime">{formatRenderDate(post.createdAt)}</p>
                </div>
                <button className="goToPostButton" onClick={() => goToPost(post._id)}>
                  Join
                </button>
              </div>

              <p className="postHeadingText">{post.title}</p>

              <div className="postInfo">
                <div className="likesBox flex-center">
                  <img src={likeSvg} alt="" />
                  <p>{post.likes}</p>
                </div>
                <div className="commentsBox flex-center">
                  <img src={commentSvg} alt="" />
                  <p>{post.comments}</p>
                </div>
                <button className="shareButton">
                  <img src={shareSvg} alt="" />
                  Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="noPostsMessage">У пользователя пока нет постов.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePosts;
