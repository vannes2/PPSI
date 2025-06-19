import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/konsultasi.css";
import { FaTags, FaBriefcase, FaGraduationCap, FaMoneyBillWave } from "react-icons/fa";

// Komponen Star Rating
const StarRating = ({ rating }) => {
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.5;
  const maxStars = 5;

  return (
    <div className="star-rating" style={{ textAlign: "center", margin: "10px 0", fontSize: "22px" }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star" style={{ color: "#f39c12" }}>★</span>
      ))}
      {hasHalfStar && <span className="star" style={{ color: "#f39c12" }}>⯪</span>}
      {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <span key={`empty-${i}`} className="star empty" style={{ color: "#ccc" }}>☆</span>
      ))}
      <span style={{ marginLeft: "6px", fontSize: "16px", color: "#555" }}>
        ({numericRating.toFixed(1)})
      </span>
    </div>
  );
};

const Konsultasi = () => {
  const { state } = useLocation();
  const [pengacara, setPengacara] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpesialisasi, setSelectedSpesialisasi] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profilpengacara");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const dataWithRating = await Promise.all(
          data.map(async (advokat) => {
            try {
              const resRating = await fetch(`http://localhost:5000/api/reviews/rating/${advokat.id}`);
              if (!resRating.ok) throw new Error("Failed to fetch rating");
              const ratingData = await resRating.json();
              return {
                ...advokat,
                rating: ratingData.average_rating || 0,
              };
            } catch {
              return { ...advokat, rating: 0 };
            }
          })
        );

        setPengacara(dataWithRating);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const spesialisasiList = [...new Set(pengacara.map((a) => a.spesialisasi))];
  const jenisHukum = state?.jenis_hukum || "";

  const filteredPengacara = pengacara.filter(
    (a) =>
      a.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpesialisasi === "" || a.spesialisasi === selectedSpesialisasi) &&
      (jenisHukum === "" || a.spesialisasi.includes(jenisHukum))
  );

  const handleKonsultasiClick = (pengacaraId) => {
    navigate("/payment", { state: { pengacaraId } });
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
            filteredPengacara.map((a) => (
              <div key={a.id} className="product-item">
                <div className="foto-advokat-container">
                  {a.upload_foto ? (
                    <img
                      src={`http://localhost:5000/uploads/${a.upload_foto}`}
                      alt={a.nama}
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
                      <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
                        Tidak ada foto
                      </span>
                    </div>
                  )}
                  <span className="online-indicator" title="Online" />
                </div>

                <h3>{a.nama}</h3>

                <div className="info-bar-horizontal">
                  <div className="info-bar"><FaTags className="info-icon" /><span>{a.spesialisasi || "-"}</span></div>
                  <div className="info-bar"><FaBriefcase className="info-icon" /><span>{a.pengalaman ?? 0} tahun</span></div>
                </div>

                <div className="info-bar-horizontal">
                  <div className="info-bar"><FaMoneyBillWave className="info-icon" /><span>{a.harga_konsultasi?.toLocaleString("id-ID") || "-"}</span></div>
                  <div className="info-bar"><FaGraduationCap className="info-icon" /><span>{a.pendidikan || "-"}</span></div>
                </div>

                <StarRating rating={a.rating} />

                <button className="btn-konsultasi" onClick={() => handleKonsultasiClick(a.id)}>
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
