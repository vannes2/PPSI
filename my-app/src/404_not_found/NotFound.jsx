import { Link } from "react-router-dom";
import Header from "../components/Header";
import HeaderAfter from "../components/HeaderAfter";
import HeaderLawyer from "../components/HeaderLawyer"; // pastikan path benar
import Footer from "../components/Footer";
import "../404_not_found/NotFound.css";
import { useEffect, useState } from "react";

const NotFound = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role ? user.role.toLowerCase() : null); // gunakan lowercase agar aman
        setIsLoggedIn(true);
      } catch {
        setUserRole(null);
        setIsLoggedIn(false);
      }
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  }, []);

  const renderHeader = () => {
    if (userRole === "pengacara") {
      return <HeaderLawyer />;
    }
    return isLoggedIn ? <HeaderAfter /> : <Header />;
  };

  return (
    <>
      {renderHeader()}

      <div className="notfound-page">
        <div className="notfound-content">
          <div className="notfound-text">
            <h1 className="notfound-heading">
              <span className="angka-hitam">4</span>
              <span className="angka-merah">0</span>
              <span className="angka-four-wrapper">
                <span className="angka-hitam">4</span>
                <img
                  src="/assets/Hukum.gif"
                  alt="Animasi Hukum"
                  className="notfound-gif-overlap"
                />
              </span>
            </h1>

            <h2>Halaman Tidak Ditemukan</h2>
            <p>Sepertinya kamu nyasar ke halaman yang belum dibuat 😅</p>

            <Link to="/" className="back-home">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>

      <div className="footer-separator" />
      <Footer />
    </>
  );
};

export default NotFound;
