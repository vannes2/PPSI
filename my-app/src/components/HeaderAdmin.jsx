import { Link } from "react-router-dom";
import "./Header.css"; // File CSS untuk Header

const HeaderAdmin = () => {
  return (
    <header>
    <h1>Cerdas Hukum - Admin</h1>
    <nav>
      <ul>
        <li><Link to="/Beranda">Beranda</Link></li>
        <li><Link to="/pengacara">Data Pengacara</Link></li>
        <li><Link to="/kasus">Data Kasus</Link></li>
        <li><Link to="/user">Data User</Link></li>
      </ul>
    </nav>
    <button>Keluar</button>
  </header>
  );
};

export default HeaderAdmin;