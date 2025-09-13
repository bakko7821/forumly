import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import googleLogo from "../assets/images/google.svg";
import appleLogo from "../assets/images/apple.svg";
import doneSvg from "../assets/images/done-round-svgrepo-com.svg";
import "../styles/Login.css";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
          type="text"
          name="username"
          placeholder="Имя пользователя"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <div className="linkBox flex-column">
            <p className="registrationPageText">Уже есть аккаунт? <Link to="/login">Войти в аккаунт</Link></p>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Зарегистрироваться
        </button>
      </form>
      {message && <div className="notificationMessage flex-center">
        <img src={doneSvg} alt="" />
        <p>{message}</p>
      </div>}
    </div>
  );
}

export default Register;
