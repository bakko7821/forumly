import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import "../styles/Profile.css";
import editSvg from "../assets/images/edit-2-svgrepo-com.svg";
import moreSvg from "../assets/images/more.svg";
import followSvg from "../assets/images/follow.svg";
import donateSvg from "../assets/images/donate.svg";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("user"));

  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchCounts = async () => {
      try {
        // запрос постов
        const postsRes = await axios.get(`http://localhost:5000/posts/${id}`);
        setPostsCount(postsRes.data.length);

        // запрос комментов
        const commentsRes = await axios.get(`http://localhost:5000/api/comments/user/${id}`);
        setCommentsCount(commentsRes.data.length);
      } catch (err) {
        console.error("Ошибка при получении счётчиков:", err);
      }
    };

    fetchCounts();
  }, [id]);

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

  function goToEditProfile() {
    navigate("/editProfile");
  }

  function formatRenderDate(dateString) {
    if (!dateString) return "";
    const userDate = new Date(dateString);
    return userDate.toLocaleDateString("ru-RU");
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
    <>
      <div className="topUserProfileInfoBox flex-column">
        <div className="userProfileContentBox flex-column">
          <div className="userInfoBox flex-center">
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
              <p className="fullName">
                {user.firstname} {user.lastname}
              </p>
              <p className="userName">@{user.username}</p>
            </div>
          </div>

          {/* Навигация */}
          <nav className="navigationBox flex-center">
            <button onClick={() => navigate(`/profile/${id}`)}>Overview</button>
            <button onClick={() => navigate(`/profile/${id}/posts`)}>Posts</button>
            <button onClick={() => navigate(`/profile/${id}/comments`)}>Comments</button>
            {user && authUser && user._id === authUser.id && (
              <button>History</button>
            )}
          </nav>
        </div>

        {/* Здесь будут рендериться вложенные страницы */}
        <div className="postsListBox flex-column">
          <Outlet />
        </div>
      </div>

      <div className="moreUserInfoBox flex-column">
        <div className="headingBox flex-between">
          <p className="userName">@{user.username}</p>
          <button className="moreButton flex-center">
            <img src={moreSvg} alt="" />
          </button>
        </div>

        {user && authUser && user._id === authUser.id ? (
          <button
            onClick={goToEditProfile}
            className="editProfileButton flex-center"
          >
            <img src={editSvg} alt="" />
            Edit profile
          </button>
        ) : (
          <div className="userButtonsBox">
            <button
              // onClick={handleFollow} // твоя функция для подписки
              className="followButton flex-center"
            >
              <img src={followSvg} alt="" />
              Follow
            </button>
            <button
              // onClick={handleFollow} // твоя функция для подписки
              className="donateButton flex-center"
            >
              <img src={donateSvg} alt="" />
            </button>
          </div>
        )}
        <div className="postsAndCommentsCountsBox flex-between">
          <div className="postsCountBox flex-column">
            <p className="countText">{postsCount}</p>
            <p className="nameText">Posts</p>
          </div>
          <div className="postsCountBox flex-column">
            <p className="countText">{commentsCount}</p>
            <div className="nameText">Comments</div>
          </div>
        </div>
        <div className="createdDateCountBox flex-column">
          <p className="countText">{formatRenderDate(user.createdAt)}</p>
          <p className="nameText">Created At</p>
        </div>

        <div className="emailCountBox flex-column">
          <p className="countText">{user.email}</p>
          <p className="nameText">Email</p>
        </div>
      </div>
    </>
  );
}

export default Profile;
