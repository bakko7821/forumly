import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

import editSvg from "../assets/images/edit-2-svgrepo-com.svg";
import mailSvg from "../assets/images/mail-alt-3-svgrepo-com.svg";
import rocketSvg from "../assets/images/rocket-svgrepo-com.svg";
import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import starSvg from "../assets/images/star.svg";
import shareSvg from "../assets/images/share.svg";

function Profile() {
  const { id } = useParams(); // <-- получаем id из URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("ID пользователя не найден");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${id}`);
        setPosts(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // у пользователя нет постов → просто показываем пустой список
          setPosts([]);
        } else {
          console.error("Ошибка при загрузке постов пользователя:", err);
          setError(err.response?.data?.message || "Ошибка при загрузке постов пользователя");
        }
      } finally {
        setLoading(false);
      }
    };


    fetchUserPosts();
  }, [id]);

  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  function formatRenderDate(dateString) {
      if (!dateString) return "";

      const userDate = new Date(dateString);
      const today = new Date();

      // убираем время, оставляем только дату
      const postDay = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
      const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffInMs = todayDay - postDay;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 0) return "Сегодня";
      if (diffInDays === 1) return "Вчера";

      return userDate.toLocaleDateString("ru-RU");
  }

  function goToEditProfile() {
    navigate(`/editProfile`);
  }

  const renderDate = formatRenderDate(user?.createdAt);
  const authUser =  JSON.parse(localStorage.getItem("user"))

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
    <div className="userProfileContentBox">
      <div className="userInfoBox flex-column">
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
        <div className="userInfoTextBox flex-column">
          <div className="fullNameBox flex-center">
            <p className="firstName">{user.firstname}</p>
            <p className="lastName">{user.lastname}</p>
          </div>
          <div className="userNameBox flex-center">
            <p className="userName">@{user.username}</p>
            <div className="circlce"></div>
            <p className="followersCount">{user.followersCount} подписчиков</p>
          </div>
        </div>
        {user && authUser && user._id === authUser.id && (
          <button onClick={goToEditProfile} className="editProfileButton flex-center">
            <img src={editSvg} alt="" />
            Изменить профиль
          </button>
        )}
        <div className="secondInfoBox flex-column">
          <div className="emailBox">
            <img src={mailSvg} alt="" />
            <p className="userEmail">{user.email}</p>
          </div>
          <div className="joinDateBox">
            <img src={rocketSvg} alt="" />
            <p className="useJoinDate">{renderDate}</p>
          </div>
        </div>
      </div>
      <div className="postsListBox flex-column">
        <p className="boxName">Список постов {user.username}:</p>
        <div className="postList flex-column">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="postCard flex-column">
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
                    <p className="userName">{user.username || "Неизвестно"}</p>
                    <div className="circle"></div>
                    <p className="postTime">{formatRenderDate(post.createdAt)}</p>
                  </div>
                  <button
                    className="goToPostButton"
                    onClick={() => goToPost(post._id)}
                  >
                    Вступить
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
                  <button className="starButton">
                    <img src={starSvg} alt="" />
                  </button>
                  <button className="shareButton">
                    <img src={shareSvg} alt="" />
                    Поделиться
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="noPostsMessage">У пользователя пока нет постов.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
