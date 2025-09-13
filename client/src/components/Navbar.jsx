import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import logoSvg from "../assets/images/logo.svg";
import scanSvg from "../assets/images/scan.svg";
import profileIconSvg from "../assets/images/profile-icon.svg";
import addPostIconSvg from "../assets/images/add_post.svg";
import logOutIconSvg from "../assets/images/logout-svgrepo-com.svg";
import qrCodeImage from "../assets/images/qrcode_url_1757792109990.svg";

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [showQR, setShowQR] = useState(false); // состояние для QR-кода
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
            <button
              className="downloadAppButton flex-center"
              onClick={() => setShowQR(true)}
            >
              <img src={scanSvg} alt="" />
              Загрузить приложение
            </button>

            {showQR && (
              <div
                className="qrOverlay"
                onClick={() => setShowQR(false)} // клик по фону закрывает
              >
                <div
                  className="qrCodeWrapper"
                  onClick={(e) => e.stopPropagation()} // чтобы клик по QR не закрывал
                >
                  <img src={qrCodeImage} alt="QR Code" className="qrCodeApp" />
                </div>
              </div>
            )}

            <Link to="/login" className="signInlink">
              Войти
            </Link>
          </div>
        ) : (
          <div className="buttonBox flex-center">
            <button
              className="downloadAppButton flex-center"
              onClick={() => setShowQR(true)}
            >
              <img src={scanSvg} alt="" />
              Загрузить приложение
            </button>

            {showQR && (
              <div
                className="qrOverlay"
                onClick={() => setShowQR(false)} // клик по фону закрывает
              >
                <div
                  className="qrCodeWrapper"
                  onClick={(e) => e.stopPropagation()} // чтобы клик по QR не закрывал
                >
                  <img src={qrCodeImage} alt="QR Code" className="qrCodeApp" />
                </div>
              </div>
            )}

            <Link to="/createPost" className="profileLink flex-center">
              <img src={addPostIconSvg} alt="" />
            </Link>
            <Link to="/profile" className="profileLink flex-center">
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
