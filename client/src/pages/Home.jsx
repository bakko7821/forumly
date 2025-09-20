import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import shareSvg from "../assets/images/share.svg";
import moreSvg from "../assets/images/more.svg";

function Home() {
  const authUser = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [user, setUser] = useState(null); // обязательно null
  const [postHistory, setPostHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Загружаем все посты
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

  // Загружаем популярных авторов
  useEffect(() => {
    axios
      .get("http://localhost:5000/users/popular")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error("Ошибка при загрузке авторов:", err));
  }, []);

  // Загружаем текущего пользователя
  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${authUser.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке профиля");
      }
    };

    fetchUser();
  }, [authUser?.id]);

  // Загружаем посты из истории пользователя
  useEffect(() => {
    if (!user || !user.history || user.history.length === 0) {
      setLoading(false);
      return;
    }

    const fetchLastThreePosts = async () => {
      setLoading(true);
      try {
        // Берём последние 3 поста и переворачиваем порядок
        const lastThreePostIds = user.history.slice(-3).reverse();

        const requests = lastThreePostIds.map((postId) =>
          axios.get(`http://localhost:5000/posts/findpost/${postId}`)
            .catch(() => null)
        );
        const responses = await Promise.all(requests);
        const postsData = responses
          .filter(res => res !== null)  // убираем несуществующие посты
          .map(res => res.data);

        setPostHistory(postsData);
      } catch (err) {
        console.error("Ошибка при загрузке истории:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке истории");
      } finally {
        setLoading(false);
      }
    };

    fetchLastThreePosts();
  }, [user]);


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

    const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffInMs = todayDay - postDay;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) return "Сегодня";
    if (diffInDays === 1) return "Вчера";

    return postDate.toLocaleDateString("ru-RU");
  }

  if (loading)
    return (
      <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
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
    <div className="homePage flex-center flex-column">
      <div className="infoBox">
        {/* Все посты */}
        <div className="postsList flex-column">
          {posts.map((post) => (
            <div key={post._id} className="postCard flex-column" onClick={() => goToPost(post._id)}>
              <div className="postHeadingInfo flex-between">
                <div className="userInfo flex-center">
                  {post.author?.image ? (
                    <img className="userAvatar" src={`http://localhost:5000${post.author.image}`} alt="avatar" />
                  ) : (
                    <div className="userAvatar flex-center">
                      <p>{post.author?.username?.charAt(0) || "?"}</p>
                    </div>
                  )}
                  <p className="userName">{post.author?.username || "Неизвестно"}</p>
                  <div className="circle"></div>
                  <p className="postTime">{formatRenderDate(post?.createdAt)}</p>
                </div>
                <div className="buttonsBox flex-center">
                  <button className="goToPostButton" onClick={() => goToPost(post._id)}>Join</button>
                  <button className="moreInfoButton flex-center">
                    <img src={moreSvg} alt="" />
                  </button>
                </div>
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
          ))}
        </div>
        
        {/* История текущего пользователя */}
        {authUser && user && user._id === authUser.id && (
          <div className="authUserInfoBox">
            <div className="historyBox flex-column">
              <div className="boxTitle">
                <p>Recent Posts</p>
                <button onClick={() => setPostHistory([])}>Clear</button>
              </div>
              <div className="historyList flex-column">
                {postHistory.length > 0 ? (
                  postHistory.map((post) => (
                    <div key={post._id} className="historyPostCard flex-between" onClick={() => goToPost(post._id)}>
                      <div className="infoPostBox flex-column">
                        <div className="userInfoBox">
                          {post.author?.image ? (
                            <img className="userAvatar" src={`http://localhost:5000${post.author.image}`} alt="avatar" />
                          ) : (
                            <div className="userAvatar flex-center">
                              <p>{post.author.username.charAt(0) || "?"}</p>
                            </div>
                          )}
                          <p className="userName">{post.author.username}</p>
                          <div className="circle"></div>
                          <p className="userName">{formatRenderDate(post.createdAt)}</p>
                        </div>
                        <p className="postTitle">{post.title}</p>
                        <div className="statsInfoBox flex-center">
                          <p className="postLikes">{post.likes} likes</p>
                          <p className="postComments">{post.comments} comments</p>
                        </div>
                      </div>
                      {post.image ? <img src={post.image} alt="Post image" /> : null}
                    </div>
                  ))
                ) : (
                  <p>История пуста</p>
                )}
              </div>
            </div>
            <div className="favoriteUsersBox flex-column">
              <p className="boxTitle">Favorite Users</p>
              <div className="favoriteUsersList">

              </div>
            </div>
          </div>
        )}

        {/* Популярные пользователи */}
        {(!authUser || user?._id !== authUser.id) && (
          <div className="usersBox flex-column">
            <p className="boxTitle">Popular Users</p>
            <div className="usersList">
              {authors.length > 0 ? (
                authors.map((author) => (
                  <div className="userCard flex-center" key={author._id} onClick={() => goToUserButton(author._id)}>
                    {author?.image ? (
                      <img className="userAvatar" src={`http://localhost:5000${author.image}`} alt="avatar" />
                    ) : (
                      <div className="userAvatar flex-center">
                        <p>{author.username.charAt(0)}</p>
                      </div>
                    )}
                    <div className="userTextBox flex-column">
                      <p className="userName">{author.username}</p>
                      <p className="userFollowersCount">{author.followersCount} followers</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Пользователей не найдено</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
