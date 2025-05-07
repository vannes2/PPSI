import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/konsultasi.css";

const Konsultasi = () => {
  const { state } = useLocation();
  const [pengacara, setPengacara] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpesialisasi, setSelectedSpesialisasi] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/profilpengacara")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPengacara(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  const spesialisasiList = [...new Set(pengacara.map((advokat) => advokat.spesialisasi))];
  const jenisHukum = state?.jenis_hukum || "";

  const filteredPengacara = pengacara.filter(
    (advokat) =>
      advokat.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpesialisasi === "" || advokat.spesialisasi === selectedSpesialisasi) &&
      (jenisHukum === "" || advokat.spesialisasi.includes(jenisHukum))
  );

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
        <br />
        <br />
        <br />
        <br />
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
                <option key={index} value={spesialisasi}>
                  {spesialisasi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-list">
          {error ? (
            <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
          ) : filteredPengacara.length > 0 ? (
            filteredPengacara.map((advokat) => (
              <div key={advokat.id} className="product-item">
                <img
                  src={
                    advokat.upload_foto
                      ? `http://localhost:5000/uploads/${advokat.upload_foto}`
                      : "/assets/img/default-profile.png"
                  }
                  alt={`Foto ${advokat.nama}`}
                  className="foto-advokat"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px"
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/img/default-profile.png";
                  }}
                />
                <h3>{advokat.nama}</h3>
                <p><strong>Spesialisasi:</strong> {advokat.spesialisasi}</p>
                <p><strong>Pengalaman:</strong> {advokat.pengalaman} tahun</p>
                <p><strong>Harga Konsultasi:</strong> Rp{advokat.harga_konsultasi.toLocaleString()}</p>
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
