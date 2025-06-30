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
  const [pengacara, setPengacara] = useState(null);
  const [rating, setRating] = useState(0); // ✅ Tambahan state rating
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("ID pengacara tidak valid");
      setLoading(false);
      return;
    }

    const fetchPengacara = async () => {
      try {
        const response = await fetch(`https://ppsi-production.up.railway.app/api/lawyer/profile/${id}`);
        if (!response.ok) {
          throw new Error("Pengacara tidak ditemukan");
        }
        const data = await response.json();
        setPengacara(data);

        // ✅ Ambil rating
        const ratingRes = await fetch(`https://ppsi-production.up.railway.app/api/reviews/rating/${id}`);
        const ratingData = await ratingRes.json();
        setRating(ratingData.average_rating || 0);

        setError(null);
      } catch (err) {
        setError(err.message);
        setPengacara(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPengacara();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="detail-page">
      <HeaderAfter />
      <br /><br /><br />

      <div className="detail-container">
        <div className="main-detail-card">
          <div className="detail-card">
            {/* Foto Pengacara */}
            <div className="detail-photo-container">
              <img
                src={
                  pengacara.upload_foto
                    ? `https://ppsi-production.up.railway.app//uploads/${pengacara.upload_foto}`
                    : "https://ppsi-production.up.railway.app//assets/default-lawyer.png"
                }
                alt={pengacara.nama}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ppsi-production.up.railway.app/assets/default-lawyer.png";
                }}
                className="detail-photo"
              />
              <h3 className="photo-name">{pengacara.nama}</h3>

              {/* ⭐ RATING BINTANG */}
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

            {/* Informasi Pengacara */}
            <div className="detail-info">
              <h2>Detail Pengacara</h2>
              <br />
              <div>
                <p><strong>Nama:</strong> <span>{pengacara.nama}</span></p>
                <p><strong>Jenis Kelamin:</strong> <span>{pengacara.jenis_kelamin}</span></p>
                <p><strong>Alamat:</strong> <span>{pengacara.alamat}</span></p>
                <p><strong>Pengalaman:</strong> <span>{pengacara.pengalaman} tahun</span></p>
              </div>
              <div>
                <p><strong>NIA:</strong> <span>{pengacara.nomor_induk_advokat}</span></p>
                <p><strong>Universitas:</strong> <span>{pengacara.universitas}</span></p>
                <p><strong>Pendidikan:</strong> <span>{pengacara.pendidikan}</span></p>
                <p><strong>Spesialisasi:</strong> <span>{pengacara.spesialisasi}</span></p>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="additional-info-card">
            <h3>Informasi Tambahan</h3>
            <div className="additional-info-content">
              {pengacara.resume_cv && (
                <div className="resume-section">
                  <p className="info-item">
                    <a
                      href={`https://ppsi-production.up.railway.app/uploads/${pengacara.resume_cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="icon-margin" /> Lihat Resume/CV
                    </a>
                  </p>
                </div>
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