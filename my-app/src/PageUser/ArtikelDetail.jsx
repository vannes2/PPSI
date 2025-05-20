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
      <br /><br /><br />
      <div className="artikel-detail-main">
        {loading ? (
          <p className="text-center text-gray-500">Memuat artikel...</p>
        ) : artikel ? (
          <div className="artikel-detail-container">
            <h1>{artikel.judul}</h1>
            <div className="artikel-detail-content">
              <div className="artikel-detail-list">
                <div className="artikel-detail-list-label">Deskripsi</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.deskripsi}</div>

                <div className="artikel-detail-list-label">Jenis Hukum</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.jenis_hukum}</div>

                <div className="artikel-detail-list-label">Nomor</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.nomor}</div>

                <div className="artikel-detail-list-label">Tahun</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.tahun}</div>

                <div className="artikel-detail-list-label">Jenis Dokumen</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.jenis_dokumen}</div>

                <div className="artikel-detail-list-label">Tempat Penetapan</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.tempat_penetapan}</div>

                <div className="artikel-detail-list-label">Status</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">{artikel.status}</div>

                <div className="artikel-detail-list-label">Tanggal Penetapan</div>
                <div className="artikel-detail-list-colon">:</div>
                <div className="artikel-detail-list-value">
                  {new Date(artikel.tanggal_penetapan).toLocaleDateString()}
                </div>
              </div>

              {artikel.filePath && (
                <button
                  onClick={() => handleDownload(artikel.filePath)}
                  className="artikel-download-btn"
                  type="button"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Artikel tidak ditemukan.</p>
        )}
      </div>
      <br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ArtikelDetail;
