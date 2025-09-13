import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import googleLogo from "../assets/images/google.svg";
import appleLogo from "../assets/images/apple.svg";
import doneSvg from "../assets/images/done-round-svgrepo-com.svg";
import "../styles/Login.css";
// import Register from "./pages/Register.jsx";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user)); // сохраним пользователя
    setMessage("Успешный вход!");
    window.location.href = "/"; // редирект на главную
  } catch (err) {
    setMessage(err.response?.data?.msg || "Ошибка");
  }
};


  return (
    <div className="loginBox flex-column flex-center">
      <p className="headingText">Войти</p>
      <p className="descriptionText">Продолжая использовать Reddit, вы тем самым соглашаетесь соблюдать наше <a href="#">Пользовательское соглашение</a> и подтверждаете, что ознакомились с <a href="#">Политикой конфиденциальности</a></p>
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />
        <div className="linkBox flex-column">
            <Link to="/register">Забыли пароль?</Link>
            <p className="registrationPageText">Новичок на форуме? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
        <button type="submit" className="">
          Войти
        </button>
      </form>
      {message && <div className="notificationMessage flex-center">
              <img src={doneSvg} alt="" />
              <p>{message}</p>
            </div>}
    </div>
  );
}

export default Login;
