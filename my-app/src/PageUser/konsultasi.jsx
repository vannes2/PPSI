import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/konsultasi.css";

const Konsultasi = () => {
    const [pengacara, setPengacara] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState(""); // State untuk filter spesialisasi
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/pengacara")  // Pastikan URL backend benar
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setPengacara(data))
            .catch(error => {
                console.error("Error fetching data:", error);
                setError(error.message);
            });
    }, []);

    // Mengambil daftar spesialisasi unik dari data pengacara
    const spesialisasiList = [...new Set(pengacara.map(advokat => advokat.spesialisasi))];

    // Filter pengacara berdasarkan nama dan spesialisasi yang dipilih
    const filteredPengacara = pengacara.filter(advokat =>
        advokat.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSpesialisasi === "" || advokat.spesialisasi === selectedSpesialisasi)
    );

    return (
        <div className="konsultasi-page">
            {/* Navbar */}
            <HeaderAfter />

            {/* Section Advokat + Search + Filter */}
            <section className="advokat-section">
                <div className="advokat-header">
                    <h2 className="product-title">Advokat Yang Tersedia</h2>
                    <div className="search-filter-container">
                        <input 
                            type="text"
                            placeholder="Cari nama pengacara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            className="filter-select"
                            value={selectedSpesialisasi}
                            onChange={(e) => setSelectedSpesialisasi(e.target.value)}
                        >
                            <option value="">Semua Spesialisasi</option>
                            {spesialisasiList.map((spesialisasi, index) => (
                                <option key={index} value={spesialisasi}>{spesialisasi}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Daftar Pengacara */}
                <div className="product-list">
                    {error ? (
                        <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
                    ) : filteredPengacara.length > 0 ? (
                        filteredPengacara.map((advokat, index) => (
                            <div key={advokat.id} className="product-item">
                                <img src={`/assets/images/advokat${index + 1}.png`} alt="Advokat" />
                                <p><strong>{advokat.nama}</strong><br />{advokat.spesialisasi}<br />Pengalaman: {advokat.pengalaman} tahun</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">Pengacara tidak ditemukan.</p>
                    )}
                </div>
            </section>

            <div className="footer-separator"></div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Konsultasi;
