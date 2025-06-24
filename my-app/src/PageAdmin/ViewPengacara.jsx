import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaGavel, FaHome } from "react-icons/fa";
import axios from "axios";

const ViewPengacara = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [pengacara, setPengacara] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPengacaraById = async () => {
      try {
        const response = await axios.get(`https://ppsi-production.up.railway.app/api/pengacara/${id}`);
        setPengacara(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengacara:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPengacaraById();
  }, [id]);

  return (
    <div className="admin-container flex">
      {/* Sidebar */}
      <aside className="sidebar w-64 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <ul>
          <li>
            <Link to="/admin" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaHome className="mr-2" /> Dashboard
            </Link>
          </li>
          <li className="bg-gray-700">
            <Link to="/HomeAdmin" className="flex items-center p-2 rounded w-full text-left">
              <FaGavel className="mr-2" /> Pengacara
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content p-4 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Detail Pengacara</h2>

        {loading ? (
  <p>Loading...</p>
) : pengacara ? (
  <div className="border rounded-lg p-4 shadow-md max-w-md bg-white">
    <table className="w-full border-collapse border border-gray-300">
      <tbody>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">ID</td>
          <td className="p-3">{pengacara.id}</td>
        </tr>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">Nama</td>
          <td className="p-3">{pengacara.nama}</td>
        </tr>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">Email</td>
          <td className="p-3">{pengacara.email || "-"}</td>
        </tr>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">No HP</td>
          <td className="p-3">{pengacara.no_hp || "-"}</td>
        </tr>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">Spesialisasi</td>
          <td className="p-3">{pengacara.spesialisasi || "-"}</td>
        </tr>
        <tr className="border border-gray-300">
          <td className="p-3 font-semibold bg-gray-200">Pengalaman</td>
          <td className="p-3">{pengacara.pengalaman || "-"} tahun</td>
        </tr>
      </tbody>
    </table>
  </div>
) : (
  <p>Data pengacara tidak ditemukan.</p>
)}


        <button
          onClick={() => navigate("/HomeAdmin")}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Kembali
        </button>
      </main>
    </div>
  );
};

export default ViewPengacara;