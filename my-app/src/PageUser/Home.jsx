import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
    const [pengacara, setPengacara] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/pengacara")  // Pastikan URL backend benar
            .then(response => response.json())
            .then(data => setPengacara(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="home-before-page">
            {/* Navbar */}
            <Header />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Selesaikan Masalah Hukum Anda Bersama Kami</h1>
                    <p>Segera daftarkan diri Anda dan selesaikan masalah hukum Anda bersama Advokat terpercaya dari Kami</p>
                    <div className="buttons">
                        <Link to="/Login"><button>Masuk</button></Link>
                        <Link to="/signup"><button>Daftar</button></Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/assets/img/themis.png" alt="Ilustrasi Header" />
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
                    {pengacara.length > 0 ? (
                        pengacara.map((advokat, index) => (
                            <div key={index} className="product-item">
                                <img src={`/assets/images/advokat${index + 1}.png`} alt="Advokat" />
                                <p><strong>{advokat.nama}</strong><br />{advokat.spesialisasi}<br />Pengalaman: {advokat.pengalaman} tahun</p>
                            </div>
                        ))
                    ) : (
                        <p>Tidak ada advokat tersedia</p>
                    )}
                </div>
            </section>

            <div className="footer-separator"></div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
