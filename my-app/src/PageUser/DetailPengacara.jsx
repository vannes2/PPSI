import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/DetailPengacara.css";

const DetailPengacara = () => {
  const { id } = useParams();
  const [pengacara, setPengacara] = useState(null);
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
        const response = await fetch(`http://localhost:5000/api/pengacara/${id}`);
        if (!response.ok) {
          throw new Error("Pengacara tidak ditemukan");
        }
        const data = await response.json();
        setPengacara(data);
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
    <div className="page-wrapper">
      <HeaderAfter />
      <main className="main-content">
        <div className="detail-container">
          <h2>Detail Pengacara</h2>
          <div className="detail-card">
            <img
              src={
                pengacara.upload_foto
                  ? `http://localhost:5000/uploads/${pengacara.upload_foto}`
                  : "http://localhost:5000/assets/default-lawyer.png"
              }
              alt={pengacara.nama}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "http://localhost:5000/assets/default-lawyer.png";
              }}
              className="detail-photo"
            />
            <div className="detail-info">
              <div>
                <p><strong>Nama:</strong> <span>{pengacara.nama}</span></p>
                <p><strong>KTP:</strong> <span>{pengacara.ktp}</span></p>
                <p><strong>Tanggal Lahir:</strong> <span>{pengacara.tanggal_lahir}</span></p>
                <p><strong>Jenis Kelamin:</strong> <span>{pengacara.jenis_kelamin}</span></p>
                <p><strong>Alamat:</strong> <span>{pengacara.alamat}</span></p>
                <p><strong>Email:</strong> <span>{pengacara.email}</span></p>
              </div>
              <div>
                <p><strong>No HP:</strong> <span>{pengacara.no_hp}</span></p>
                <p><strong>Nomor Induk Advokat:</strong> <span>{pengacara.nomor_induk_advokat}</span></p>
                <p><strong>Universitas:</strong> <span>{pengacara.universitas}</span></p>
                <p><strong>Pendidikan:</strong> <span>{pengacara.pendidikan}</span></p>
                <p><strong>Spesialisasi:</strong> <span>{pengacara.spesialisasi}</span></p>
                <p><strong>Pengalaman:</strong> <span>{pengacara.pengalaman} tahun</span></p>
                <p><strong>Harga Konsultasi:</strong> <span>Rp {pengacara.harga_konsultasi?.toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailPengacara;
