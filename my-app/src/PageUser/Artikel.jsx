import { useEffect, useState } from 'react';
import axios from 'axios';

const Artikel = () => {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/artikel'); // Pastikan endpoint sesuai
      setArtikels(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil artikel:', err);
      setLoading(false);
    }
  };

  const handleDownload = (filePath) => {
    const fileName = filePath.split(/[\\/]/).pop(); // handle path Windows/Linux
    window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Artikel PDF</h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : artikels.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada artikel tersedia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Judul</th>
                <th className="p-3 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {artikels.map((artikel) => (
                <tr key={artikel.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{artikel.judul}</td>
                  <td className="p-3 border text-center">
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
    </div>
  );
};

export default Artikel;
