import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import "./styles/App.css";

function App() {
  return (
    <div className="contentBox flex-center flex-column">
      <Navbar />

      <div className="mainContainer flex-center">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<h1 className="text-2xl">Главная страница 🚀</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
