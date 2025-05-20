import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Artikel.css";

const Artikel = () => {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artikel");
      setArtikels(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
      setLoading(false);
    }
  };

  const filteredArtikels = artikels.filter(
    (artikel) =>
      artikel.judul.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterJenis === "" || artikel.jenis_hukum === filterJenis)
  );

  const handleDownload = (filePath) => {
    const fileName = filePath.split(/[\\/]/).pop();
    window.open(`http://localhost:5000/uploads/${fileName}`, "_blank");
  };

  return (
    <div className="artikel-page">
      <HeaderAfter />
      <br /><br />
      <div className="artikel-header-bar">
        <h1 className="artikel-heading">Daftar Dokumen</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="artikel-scroll-wrapper">
          <div className="artikel-scroll-inner">
            <table className="artikel-table">
              <thead>
                <tr>
                  <th className="artikel-th artikel-th-rounded">
                    <div className="artikel-th-flex">
                      <span className="artikel-th-title">Filter</span>
                      <input
                        type="text"
                        className="artikel-filter-input-inline"
                        placeholder="Cari judul..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                      <select
                        value={filterJenis}
                        onChange={(e) => setFilterJenis(e.target.value)}
                        className="artikel-filter-input-inline"
                      >
                        <option value="">Semua Jenis</option>
                        <option value="KDRT">KDRT</option>
                        <option value="perceraian">perceraian</option>
                        <option value="pelanggaran_HAM">pelanggaran HAM</option>
                      </select>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredArtikels.length === 0 ? (
                  <tr>
                    <td className="artikel-td">
                      <p className="text-gray-500">Tidak ada artikel ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredArtikels.map((artikel, index) => (
                    <tr key={artikel.id} className="artikel-tr artikel-tr-hover">
                      <td className={`artikel-td ${index === filteredArtikels.length - 1 ? "artikel-td-rounded" : ""}`}>
                        <div className="artikel-judul">
                          <Link to={`/artikel/${artikel.id}`} className="artikel-judul-link">
                            {artikel.judul}
                          </Link>
                        </div>
                        <div className="artikel-deskripsi">{artikel.deskripsi}</div>
                        <div className="artikel-info-horizontal">
                          <p><strong>Jenis Hukum:</strong> {artikel.jenis_hukum}</p>
                          <div className="artikel-tanggal-wrapper">
                            <span className="tahun-box">{artikel.tahun}</span>
                            <span className="tanggal-box">
                              {new Date(artikel.tanggal_penetapan).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <br />
                        <button
                          onClick={() => handleDownload(artikel.filePath)}
                          className="artikel-download-btn"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Artikel;
