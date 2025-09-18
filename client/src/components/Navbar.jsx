import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import logoSvg from "../assets/images/logo.svg";
import profileIconSvg from "../assets/images/profile-icon.svg";
import addPostIconSvg from "../assets/images/add_post.svg";
import logOutIconSvg from "../assets/images/logout-svgrepo-com.svg";

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);// состояние для QR-кода
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
            <Link to="/login" className="signInlink">
              Войти
            </Link>
        ) : (
          <div className="buttonBox flex-center">
            <Link to="/createPost" className="profileLink flex-center">
              <img src={addPostIconSvg} alt="" />
            </Link>
            <Link to={`/profile/${JSON.parse(localStorage.getItem("user")).id}`} className="profileLink flex-center">
              <img src={profileIconSvg} alt="" />
            </Link>
            <Link onClick={handleLogout} className="profileLink flex-center">
              <img src={logOutIconSvg} alt="" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
