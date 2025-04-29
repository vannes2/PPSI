import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/konsultasi.css";

const Konsultasi = () => {
    const [pengacara, setPengacara] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/pengacara")
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

    const spesialisasiList = [...new Set(pengacara.map(advokat => advokat.spesialisasi))];

    const filteredPengacara = pengacara.filter(advokat =>
        advokat.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSpesialisasi === "" || advokat.spesialisasi === selectedSpesialisasi)
    );

    // Fungsi navigasi ke halaman chat
    const handleKonsultasiClick = (advokatId) => {
        navigate(`/chat/pengacara/${advokatId}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div className="konsultasi-page">
            <HeaderAfter />

            <section className="advokat-section">
                <br/><br/><br/><br/>
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

                <div className="product-list">
                    {error ? (
                        <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
                    ) : filteredPengacara.length > 0 ? (
                        filteredPengacara.map((advokat, index) => (
                            <div key={advokat.id} className="product-item">
                                <img src={`/assets/images/advokat${index + 1}.png`} alt={`Advokat ${advokat.nama}`} />
                                <p>
                                    <strong>{advokat.nama}</strong><br />
                                    {advokat.spesialisasi}<br />
                                    Pengalaman: {advokat.pengalaman} tahun
                                </p>
                                <button 
                                    className="btn-konsultasi"
                                    onClick={() => handleKonsultasiClick(advokat.id)}
                                >
                                    Klik Konsultasi
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">Pengacara tidak ditemukan.</p>
                    )}
                </div>
            </section>

            <div className="footer-separator"></div>
            <Footer />
        </div>
    );
};

export default Konsultasi;
