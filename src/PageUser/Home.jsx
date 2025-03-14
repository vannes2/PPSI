import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="home-before-page">
            {/* Navbar */}
          <Header />


            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Selesaikan Masalah Hukum Anda Bersama Kami</h1>
                    <p>Segera daftarkan diri anda dan aelesaikan masalah hukum Anda bersama Advokat terpercaya dari Kami</p>
                    <div className="buttons">
                        <Link to="/Login"><button>Masuk</button></Link>
                        <Link to="/signup"><button>Daftar</button></Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/assets/img/FOTOHUKUM.png" style={{}} alt="Ilustrasi Header" />
                </div>
            </section>

            {/* Produk Section */}
            <section className="products">
                <div className="product-section">
                    <h2 className="product-title">Advokat Yang Tersedia</h2>
                    <div className="auth-buttons">
                        <Link to="/Login" className="btn-right"><button>Selengkapnya &gt;</button></Link>
                    </div>
                </div>
                <div className="product-list">
                    {[1,2,3,4,5].map((item, index) => (
                        <div key={index} className="product-item">
                            <img src={`/assets/images/gambarheader${item}.png`} alt="Produk" />
                            <p><strong>Advokat {item}</strong><br />Deskripsi singkat Advokat<br />RpXXX.XXX</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="footer-separator"></div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
