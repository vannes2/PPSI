import { useEffect, useState } from "react";
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

  const handleDownload = (filePath) => {
    const fileName = filePath.split(/[\\/]/).pop();
    window.open(`http://localhost:5000/uploads/${fileName}`, "_blank");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredArtikels = artikels.filter(
    (artikel) =>
      artikel.judul.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterJenis === "" || artikel.jenis_hukum === filterJenis)
  );

  return (
    <div className="artikel-page">
      <HeaderAfter />
      <br /><br /><br /><br /><br /><br />
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
                      <span className="artikel-th-title">Judul & Deskripsi</span>
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
                      <td
                        className={`artikel-td ${
                          index === filteredArtikels.length - 1 ? "artikel-td-rounded" : ""
                        }`}
                      >
                        <div className="artikel-judul">{artikel.judul}</div>
                        <div className="artikel-deskripsi">{artikel.deskripsi}</div>
                        <div className="artikel-jenis">
                          <strong>Jenis Hukum:</strong> {artikel.jenis_hukum}
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
