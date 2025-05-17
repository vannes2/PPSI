import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/ArtikelDetail.css";

const ArtikelDetail = () => {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtikelDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/artikel/${id}`);
        setArtikel(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
        setLoading(false);
      }
    };

    fetchArtikelDetail();
  }, [id]);

  const handleDownload = (filePath) => {
    const fileName = filePath.split(/[\\/]/).pop();
    window.open(`http://localhost:5000/uploads/${fileName}`, "_blank");
  };

  return (
    <div className="artikel-detail-page">
      <HeaderAfter />
      <div className="artikel-detail-main">
        {loading ? (
          <p className="text-center text-gray-500">Memuat artikel...</p>
        ) : artikel ? (
          <div className="artikel-detail-container">
            <h1>{artikel.judul}</h1>
            <div className="artikel-detail-content">
              <p><strong>Deskripsi:</strong> {artikel.deskripsi}</p>
              <p><strong>Jenis Hukum:</strong> {artikel.jenis_hukum}</p>
              <p><strong>Nomor:</strong> {artikel.nomor}</p>
              <p><strong>Tahun:</strong> {artikel.tahun}</p>
              <p><strong>Jenis Dokumen:</strong> {artikel.jenis_dokumen}</p>
              <p><strong>Tempat Penetapan:</strong> {artikel.tempat_penetapan}</p>
              <p><strong>Status:</strong> {artikel.status}</p>
              <p><strong>Tanggal Penetapan:</strong> {new Date(artikel.tanggal_penetapan).toLocaleDateString()}</p>
              {artikel.filePath && (
                <button onClick={() => handleDownload(artikel.filePath)} className="artikel-download-btn">
                  Download PDF
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Artikel tidak ditemukan.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ArtikelDetail;
