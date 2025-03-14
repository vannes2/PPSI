import { Link } from "react-router-dom";
import "./Header.css"; // File CSS untuk Header

const Header = () => {
  return (
    <header>
        <div className="logo">
          <img src="assets/img/LogoKecil.png" style={{ width: '100px', height: '100px' }} alt="Cerdas Hukum" />
        </div>
        <nav>
          <ul>
            <li><Link to="/">BERANDA</Link></li>
            <li><Link to="/AboutUs">TENTANG KAMI</Link></li>
            <li><Link to="/Login">KONSULTASI</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/Login"><button>Masuk</button></Link>
        </div>
      </header>
  );
};

export default Header;


