import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/DetailPengacara.css";

const DetailPengacara = () => {
  const { id } = useParams();
  const [pengacara, setPengacara] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setPengacara(null);
      return;
    }

    const fetchPengacara = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pengacara/${id}`);
        if (!response.ok) {
          throw new Error("Pengacara tidak ditemukan");
        }
        const data = await response.json();
        setPengacara(data);
      } catch (error) {
        console.error("Gagal mengambil data pengacara:", error.message);
        setPengacara(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPengacara();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!pengacara) return <p>Pengacara tidak ditemukan.</p>;

  return (
    <div className="detail-container">
      <HeaderAfter />
      <div className="detail-content">
        <h2>Detail Pengacara</h2>
        <div className="detail-card">
          <img
            src={
              pengacara.foto
                ? `http://localhost:5000/uploads/${pengacara.foto}`
                : "http://localhost:5000/assets/default-lawyer.png"
            }
            alt="Foto Pengacara"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "http://localhost:5000/assets/default-lawyer.png";
            }}
          />
          <div className="detail-info">
            <p><strong>Nama:</strong> {pengacara.nama}</p>
            <p><strong>Email:</strong> {pengacara.email}</p>
            <p><strong>No HP:</strong> {pengacara.no_hp}</p>
            <p><strong>Spesialisasi:</strong> {pengacara.spesialisasi || "-"}</p>
            <p><strong>Area Praktik:</strong> {pengacara.area_praktik || "-"}</p>
            <p><strong>Pengalaman:</strong> {pengacara.pengalaman || "-"} tahun</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailPengacara;
