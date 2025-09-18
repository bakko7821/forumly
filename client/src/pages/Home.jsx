import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import starSvg from "../assets/images/star.svg";
import shareSvg from "../assets/images/share.svg";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке постов:", err);
      }
    };
    fetchPosts();
  }, []);

  const [authors, setAuthors] = useState([])
  useEffect(() => {
    axios.get("http://localhost:5000/users/popular")
      .then(res => setAuthors(res.data))
      .catch(err => console.error("Ошибка при загрузке авторов:", err));
  }, []);

  const navigate = useNavigate();

  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  function goToUserButton(userId) {
    navigate(`/profile/${userId}`);
  }

    function formatRenderDate(dateString) {
      if (!dateString) return "";

      const postDate = new Date(dateString);
      const today = new Date();

      // убираем время, оставляем только дату
      const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
      const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffInMs = todayDay - postDay;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 0) return "Сегодня";
      if (diffInDays === 1) return "Вчера";

      return postDate.toLocaleDateString("ru-RU");
  }

  return (
    <div className="homePage flex-ceneter flex-column">
      <div className="infoBox">
        <div className="postsList flex-column">
          {posts.map((post) => (
            <div key={post._id} className="postCard flex-column">
              <div className="postHeadingInfo flex-between">
                <div className="userInfo flex-center">
                  {post.author ? (
                    post.author.image && post.author.image.trim() !== "" ? (
                      <img
                        className="userAvatar"
                        src={`http://localhost:5000${post.author.image}`}
                        alt="avatar"
                      />
                    ) : (
                      <div className="userAvatar flex-center">
                        <p>{post.author.username.charAt(0)}</p>
                      </div>
                    )
                  ) : (
                    <div className="userAvatar flex-center">
                      <p>?</p>
                    </div>
                  )}
                  <p className="userName">{post.author?.username || "Неизвестно"}</p>
                  <div className="circle"></div>
                  <p className="postTime">{formatRenderDate(post?.createdAt)}</p>
                </div>
                <button className="goToPostButton" onClick={() => goToPost(post._id)}>Вступить</button>
              </div>
              <p className="postHeadingText">{post.title}</p>
              {/* <p>{post.text}</p> */}
              <div className="postInfo">
                <div className="likesBox flex-center">
                  <img src={likeSvg} alt="" />
                  <p>{post.likes}</p>
                </div>
                <div className="commentsBox flex-center">
                  <img src={commentSvg} alt="" />
                  <p>{post.comments}</p>
                </div>
                <button className="starButton">
                  <img src={starSvg} alt="" />
                </button>
                <button className="shareButton">
                  <img src={shareSvg} alt="" />
                  Поделиться
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="usersBox flex-center flex-column">
          <p>Популярные пользователи</p>
          <div className="usersList flex-column">
            {authors.map(user => (
              <button onClick={() => goToUserButton(user._id)} className="userCard" key={user._id}>
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
                <div className="userInfo flex-column">
                  <p className="userName">{user.username}</p>
                  <p className="userFollowersCount">{user.followersCount} подписчиков</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
