import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const HomeAfter = () => {
    const [pengacara, setPengacara] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/pengacara")
            .then(response => response.json())
            .then(data => setPengacara(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="home-before-page">
            <HeaderAfter />
            <br/><br/><br/>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h1>Selesaikan Masalah Hukum Anda Bersama Kami</h1>
                    <p>Cerdas Hukum, tempat di mana perjuangan dimulai!</p>
                    <div className="buttons">
                        <Link to="/Konsultasi">
                            <button>Konsultasi</button>
                        </Link>
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
                        <Link to="/konsultasi" className="btn-right">
                            <button>Selengkapnya &gt;</button>
                        </Link>
                    </div>
                </div>
                <div className="product-list">
                    {pengacara.length > 0 ? (
                        pengacara.slice(0, 4).map((advokat, index) => (
                            <div key={advokat.id || index} className="product-item">
                                <img src={`/assets/images/advokat${index + 1}.png`} alt={`Advokat ${advokat.nama}`} />
                                <p>
                                    <strong>{advokat.nama}</strong><br />
                                    {advokat.spesialisasi}<br />
                                    Pengalaman: {advokat.pengalaman} tahun
                                </p>
                                {/* Tombol Klik Konsultasi */}
                                <Link to="/Konsultasi">
                                    <button className="btn-konsultasi">Klik Konsultasi</button>
                                </Link>
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

export default HomeAfter;
