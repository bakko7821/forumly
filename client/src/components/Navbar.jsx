import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import searchSvg from "../assets/images/search.svg";
import profileIconSvg from "../assets/images/profile-icon.svg";
import addPostIconSvg from "../assets/images/add_post.svg";
import logOutIconSvg from "../assets/images/logout-svgrepo-com.svg";

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/home");
  };

  // Список страниц, где searchBox не нужен
  const hiddenSearchRoutes = ["/login", "/register"];
  const hideSearch = hiddenSearchRoutes.includes(location.pathname);

  return (
    <nav className="navBox flex-between">
      <Link to="/" className="mainLogo flex-center">
        F
      </Link>

      {!hideSearch && (
        <div className="searchBox">
          <img src={searchSvg} alt="" />
          <input type="search" name="search" id="search" placeholder="Search" />
        </div>
      )}

      <div>
        {!isAuth ? (
          <Link to="/login" className="signInlink">
            Sign in
          </Link>
        ) : (
          <div className="buttonBox flex-center">
            <Link to="/createPost" className="profileLink flex-center">
              <img src={addPostIconSvg} alt="" />
            </Link>
            <Link
              to={`/profile/${JSON.parse(localStorage.getItem("user")).id}`}
              className="profileLink flex-center"
            >
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
