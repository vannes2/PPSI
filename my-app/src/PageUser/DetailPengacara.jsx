import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/DetailPengacara.css";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const DetailPengacara = () => {
  const { id } = useParams();
  const [pengacara, setPengacara] = useState({});
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://ppsi-production.up.railway.app";

  useEffect(() => {
    if (!id) {
      setError("ID pengacara tidak valid");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pengacara/${id}`);
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("Data pengacara tidak ditemukan.");
        }
        const data = await res.json();
        setPengacara(data);

        const ratingRes = await fetch(`${BASE_URL}/api/reviews/rating/${id}`);
        const ratingType = ratingRes.headers.get("content-type");
        if (ratingRes.ok && ratingType?.includes("application/json")) {
          const ratingData = await ratingRes.json();
          setRating(ratingData.average_rating || 0);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        setPengacara({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="detail-page">
      <HeaderAfter />
      <br /><br /><br />

      <div className="detail-container">
        <div className="main-detail-card">
          <div className="detail-card">
            <div className="detail-photo-container">
              <img
                src={
                  pengacara.upload_foto
                    ? `${BASE_URL}/uploads/${pengacara.upload_foto}`
                    : `${BASE_URL}/assets/default-lawyer.png`
                }
                alt={pengacara.nama || "Foto Pengacara"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${BASE_URL}/assets/default-lawyer.png`;
                }}
                className="detail-photo"
              />
              <h3 className="photo-name">{pengacara.nama || "Tidak diketahui"}</h3>

              <div className="rating-stars">
                {(() => {
                  const fullStars = Math.floor(rating);
                  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                  return (
                    <>
                      {[...Array(fullStars)].map((_, i) => (
                        <span key={`full-${i}`} className="star full">★</span>
                      ))}
                      {hasHalfStar && <span className="star half">⯪</span>}
                      {[...Array(emptyStars)].map((_, i) => (
                        <span key={`empty-${i}`} className="star empty">★</span>
                      ))}
                    </>
                  );
                })()}
                <span className="rating-number">
                  ({isNaN(Number(rating)) ? "0.0" : Number(rating).toFixed(1)})
                </span>
              </div>
            </div>

            <div className="detail-info">
              <h2>Detail Pengacara</h2>
              <br />
              <div>
                <p><strong>Nama:</strong> <span>{pengacara.nama || "Tidak tersedia"}</span></p>
                <p><strong>Jenis Kelamin:</strong> <span>{pengacara.jenis_kelamin || "Tidak tersedia"}</span></p>
                <p><strong>Alamat:</strong> <span>{pengacara.alamat || "Tidak tersedia"}</span></p>
                <p><strong>Pengalaman:</strong> <span>{pengacara.pengalaman || 0} tahun</span></p>
              </div>
              <div>
                <p><strong>NIA:</strong> <span>{pengacara.nomor_induk_advokat || "-"}</span></p>
                <p><strong>Universitas:</strong> <span>{pengacara.universitas || "-"}</span></p>
                <p><strong>Pendidikan:</strong> <span>{pengacara.pendidikan || "-"}</span></p>
                <p><strong>Spesialisasi:</strong> <span>{pengacara.spesialisasi || "-"}</span></p>
              </div>
            </div>
          </div>

          <div className="additional-info-card">
            <h3>Informasi Tambahan</h3>
            <div className="additional-info-content">
              {pengacara.resume_cv ? (
                <div className="resume-section">
                  <p className="info-item">
                    <a
                      href={`${BASE_URL}/uploads/${pengacara.resume_cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="icon-margin" /> Lihat Resume/CV
                    </a>
                  </p>
                </div>
              ) : (
                <p className="info-item">Resume belum tersedia.</p>
              )}

              <div className="social-media-links">
                {pengacara.linkedin && (
                  <a href={pengacara.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" className="linkedin-color" />
                  </a>
                )}
                {pengacara.instagram && (
                  <a href={pengacara.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <FontAwesomeIcon icon={faInstagram} size="2x" className="instagram-color" />
                  </a>
                )}
                {pengacara.twitter && (
                  <a href={pengacara.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <FontAwesomeIcon icon={faTwitter} size="2x" className="twitter-color" />
                  </a>
                )}

                {!pengacara.linkedin && !pengacara.instagram && !pengacara.twitter && (
                  <p className="info-item" style={{ fontStyle: "italic", color: "#777" }}>
                    Tidak ada media sosial tersedia.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default DetailPengacara;
