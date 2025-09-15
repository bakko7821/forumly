import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";
import editSvg from "../assets/images/edit-2-svgrepo-com.svg"
import mailSvg from "../assets/images/mail-alt-3-svgrepo-com.svg"
import rocketSvg from "../assets/images/rocket-svgrepo-com.svg"

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

  if (loading) return <p>Загрузка...</p>;
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
      <div className="postsListBox">
        <p className="boxName">Список постов {user.username}:</p>
        <div className="postList">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="postItem">
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                <small>Дата: {new Date(post.createdAt).toLocaleDateString("ru-RU")}</small>
                <p>Лайки: {post.likes.length}</p>
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
