import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

import { useNavigate } from "react-router-dom";

import editSvg from "../assets/images/edit-2-svgrepo-com.svg"
import mailSvg from "../assets/images/mail-alt-3-svgrepo-com.svg"
import rocketSvg from "../assets/images/rocket-svgrepo-com.svg"
import likeSvg from "../assets/images/like.svg";
import commentSvg from "../assets/images/comment.svg";
import starSvg from "../assets/images/star.svg";
import shareSvg from "../assets/images/share.svg";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    let userId = userLocal.id;

    userId = userId.replace(/"/g, "");

    console.log("Запрашиваем пользователя с ID:", userId);

    if (!userId) {
      setError("Вы не авторизованы!");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formattedDate = user ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "";

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    let userId = userLocal.id;

    userId = userId.replace(/"/g, "");

    console.log("Запрашиваем посты пользователя с ID:", userId);

    if (!userId) {
      setError("Вы не авторизованы!");
      setLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${userId}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке постов пользователя:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке постов пользователя");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
    // console.log(posts)
  }, []);

  const navigate = useNavigate();

  function goToPost(postId) {
    navigate(`/post/${postId}`);
  }

  if (loading) return (
    <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="userProfileContentBox">
      <div className="userInfoBox flex-column">
        <div className="userAvatar"></div>
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
        <button className="editProfileButton flex-center">
          <img src={editSvg} alt="" />
          Изменить профиль
        </button>
        <div className="secondInfoBox flex-column">
          <div className="emailBox">
            <img src={mailSvg} alt="" />
            <p className="userEmail">{user.email}</p>
          </div>
          <div className="joinDateBox">
            <img src={rocketSvg} alt="" />
            <p className="useJoinDate">{formattedDate}</p>
          </div>
        </div>
      </div>
      <div className="postsListBox flex-column">
        <p className="boxName">Список постов {user.username}:</p>
        <div className="postList flex-column">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="postCard flex-column">
                <div className="postHeadingInfo flex-between">
                  <div className="userInfo flex-center">
                    <div className="userAvatar"></div>
                    <p className="userName">{user.username || "Неизвестно"}</p>
                    <div className="circle"></div>
                    <p className="postTime">3 часа назад</p>
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
            ))
          ) : (
            <p>У пользователя пока нет постов.</p>
          )}
        </div>
      </div>
    </div>
    
  );
}

export default Profile;

