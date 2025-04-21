import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_User/Artikel.css';

const ArtikelLawyer = () => {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artikel');
      setArtikels(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil artikel:', err);
      setLoading(false);
    }
  };

  const handleDownload = (filePath) => {
    const fileName = filePath.split(/[\\/]/).pop();
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
  };

  return (
    <div>
      <HeaderLawyer />
      <br />
      <h1 className="text-3xl font-bold mb-6 artikel-heading text-center">
        Daftar Artikel
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : artikels.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada artikel tersedia.</p>
      ) : (
        <div className="artikel-scroll-wrapper">
          <div className="artikel-scroll-inner">
            <table className="artikel-table">
              <thead>
                <tr>
                  <th className="artikel-th artikel-th-rounded">
                    Judul & Deskripsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {artikels.map((artikel, index) => (
                  <tr key={artikel.id} className="artikel-tr artikel-tr-hover">
                    <td
                      className={`artikel-td ${
                        index === artikels.length - 1 ? 'artikel-td-rounded' : ''
                      }`}
                    >
                      <div className="artikel-judul">{artikel.judul}</div>
                      <div className="artikel-deskripsi">{artikel.deskripsi}</div>
                      <button
                        onClick={() => handleDownload(artikel.filePath)}
                        className="artikel-download-btn"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ArtikelLawyer;
