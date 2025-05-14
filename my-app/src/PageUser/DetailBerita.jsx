import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/DetailBerita.css"; // (optional: buat CSS jika belum ada)

const DetailBerita = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // scroll ke atas
    axios
      .get(`http://localhost:5000/api/artikel-berita/${id}`)
      .then((res) => setBerita(res.data))
      .catch((err) => {
        console.error("Gagal memuat detail berita:", err);
        setError("Berita tidak ditemukan.");
      });
  }, [id]);

  if (error) {
    return (
      <div>
        <HeaderAfter />
        <div style={{ padding: "100px", textAlign: "center", color: "red" }}>{error}</div>
        <Footer />
      </div>
    );
  }

  if (!berita) {
    return (
      <div>
        <HeaderAfter />
        <br/><br/><br/><br/><br/><br/>
        <div style={{ padding: "100px", textAlign: "center" }}>Memuat berita...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="detail-berita-page">
      <HeaderAfter />
      <div className="detail-container">
        <h1 className="detail-title">{berita.judul}</h1>
        <img
          src={`http://localhost:5000/uploads/${berita.gambar}`}
          alt={berita.judul}
          className="detail-image"
        />
        <p className="detail-content">{berita.isi}</p>
      </div>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default DetailBerita;
