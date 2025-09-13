import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logoSvg from "../assets/images/logo.svg";
import scanSvg from "../assets/images/scan.svg";

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <nav className="navBox flex-between">
      <Link to="/" className="mainLogo flex-center">
        <img src={logoSvg} alt="На главную." />
        forumly
      </Link>

      <div>
        {!isAuth ? (
            <div className="buttonBox flex-center">
                <button className="downloadAppButton flex-center">
                    <img src={scanSvg} alt="" />
                    Загрузить приложение
                </button>
                <Link
                    to="/login"
                    className="signInlink"
                >
                    Войти
                </Link>
            </div>
          
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Мой профиль
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
