import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/konsultasi.css";
import { FaTags, FaBriefcase,  FaGraduationCap, FaMoneyBillWave } from "react-icons/fa";

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
    navigate("/payment", {
      state: { pengacaraId: advokatId }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="konsultasi-page">
      <HeaderAfter />
      <section className="advokat-section">
        <br /><br /><br /><br />
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
                <div className="foto-advokat-container">
                  {advokat.upload_foto ? (
                    <img
                      src={`http://localhost:5000/uploads/${advokat.upload_foto}`}
                      alt={advokat.nama}
                      className="foto-advokat"
                    />
                  ) : (
                    <div
                      style={{
                        width: "160px",
                        height: "200px",
                        borderRadius: "12px",
                        backgroundColor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          color: "#999",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        Tidak ada foto
                      </span>
                    </div>
                  )}
                  <span className="online-indicator" title="Online" />
                </div>

                <h3>{advokat.nama}</h3>

                <div className="info-bar-horizontal">
                  <div className="info-bar">
                    <FaTags className="info-icon" />
                    <span>{advokat.spesialisasi || "-"}</span>
                  </div>
                  <div className="info-bar">
                    <FaBriefcase className="info-icon" />
                    <span>{advokat.pengalaman ?? 0} tahun</span>
                  </div>
                </div>
                
                <div className="info-bar-horizontal">
                <div className="info-bar">
                  <FaMoneyBillWave className="info-icon" />
                  <span>
                    {advokat.harga_konsultasi?.toLocaleString("id-ID") || "-"}
                  </span>
                </div>

                <div className="info-bar">
                  <FaGraduationCap className="info-icon" />
                  <span>{advokat.pendidikan || "-"}</span>
                </div>
                </div>

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
