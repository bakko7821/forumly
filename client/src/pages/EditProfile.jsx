import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditProfile.css";

import arrowBackSvg from "../assets/images/arrow-back.svg";

function EditProfile() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // локальное состояние для формы
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");

  // для аватара
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (!authUser?.id) {
      setError("ID пользователя не найден");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${authUser.id}`
        );
        setUser(res.data);

        // заполнить поля текущими данными
        setFirstname(res.data.firstname);
        setLastname(res.data.lastname);
        setUsername(res.data.username);

        // если есть аватар, показать его
        if (res.data.image) setAvatarPreview(`http://localhost:5000${res.data.image}`);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.message || "Ошибка при загрузке профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser?.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function handleSave() {
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("username", username);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await axios.put(
        `http://localhost:5000/users/${authUser.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Пользователь обновлён:", res.data);
      alert("Изменения сохранены!");
      navigate(`/profile/${authUser.id}`);
    } catch (err) {
      console.error("❌ Ошибка при обновлении:", err);
      alert("Ошибка при сохранении изменений!");
    }
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
    <div className="editProfilePage flex-column" id={authUser.id}>
      <div className="headingBox flex-between">
        <div className="headingUserInfo flex-center">
          <button className="backButton flex-center" onClick={() => navigate(-1)}>
            <img src={arrowBackSvg} alt="Назад" />
          </button>
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
          <div className="userInfoText flex-column">
            <div className="headingText flex-center">
              <p className="fullNameUser">{user.firstname} {user.lastname}</p>
              <p className="userNameText">(@{user.username})</p>
            </div>
            <p className="followersCountText">{user.followersCount} подписчиков</p>
          </div>
        </div>
        <button onClick={handleSave} className="saveChangesButton">
          Сохранить изменения
        </button>
      </div>

      <div className="editProfileBox flex-center">
        <form onSubmit={(e) => e.preventDefault()} className="infoForm flex-column">
          <p>Имя</p>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <p>Фамилия</p>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <p>Имя пользователя</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>

        <form className="avatarForm" onSubmit={(e) => e.preventDefault()}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="userAvatar" />
          ) : (
            <div className="userAvatar">
              <p>{user.username.charAt(0)}</p>
            </div>
          )}

          <label className="fileLabel">
            <input type="file" className="fileInput" onChange={handleFileChange} />
            Выберите файл
          </label>

          <p className="fileHint">Поддерживаются форматы: jpg, png</p>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
