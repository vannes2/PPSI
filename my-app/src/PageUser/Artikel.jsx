import { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const styles = {
  table: {
    borderCollapse: 'collapse',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '1rem',
  },
  th: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
  },
  trHover: {
    backgroundColor: '#f9fafb',
  },
};

const Artikel = () => {
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
    const fileName = filePath.split(/[\\/]/).pop(); // agar path Windows/Linux aman
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
  };

  return (
    <div>
      <HeaderAfter />
      <br></br>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}
      >
        Daftar Artikel
      </h1>
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : artikels.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada artikel tersedia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Judul</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {artikels.map((artikel) => (
                <tr
                  key={artikel.id}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td style={styles.td}>{artikel.judul}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      onClick={() => handleDownload(artikel.filePath)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <br></br>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Artikel;
