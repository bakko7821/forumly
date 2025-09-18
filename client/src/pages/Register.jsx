import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import googleLogo from "../assets/images/google.svg";
import appleLogo from "../assets/images/apple.svg";
import doneSvg from "../assets/images/done-round-svgrepo-com.svg";
import "../styles/Login.css";

function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "", 
    email: "", 
    password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Ошибка");
    }
  };

  return (
    <div className="loginBox flex-column flex-center">
      <p className="headingText">Регистрация</p>
      <button className="useAuthButton flex-center">
        <img src={googleLogo} alt="" />
        Вход с аккаунтом Google
      </button>
      <button className="useAuthButton flex-center">
        <img src={appleLogo} alt="" />
        Вход с аккаунтом Apple
      </button>
      <div className="orBox flex-center">
        <span></span>
        <p>ИЛИ</p>
        <span></span>
      </div>
      <form onSubmit={handleSubmit} className="flex-column flex-center">
        <div className="fullNameBox flex-center">
          <div className="floating-input">
          <input
            type="firstname"
            id="firstname"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            placeholder="Имя"
            required
          />
          <label htmlFor="firstname">Имя</label>
        </div>
        <div className="floating-input">
          <input
            type="lastname"
            id="lastname"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder="Фамилия"
            required
          />
          <label htmlFor="lastname">Фамилия</label>
        </div>
        </div>
        {/* Username */}
        <div className="floating-input">
          <input
            type="username"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="@Имя пользователя"
            required
          />
          <label htmlFor="username">@Имя пользователя</label>
        </div>
        {/* Email */}
        <div className="floating-input">
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Электронная почта"
            required
          />
          <label htmlFor="email">Электронная почта</label>
        </div>

        {/* Password */}
        <div className="floating-input">
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
          />
          <label htmlFor="password">Пароль</label>
        </div>

        <div className="linkBox flex-column">
            <p className="registrationPageText">Уже есть аккаунт? <Link to="/login">Войти в аккаунт</Link></p>
        </div>

        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <div className="notificationMessage flex-center">
        <img src={doneSvg} alt="" />
        <p>{message}</p>
      </div>}
    </div>
  );
}

export default Register;
