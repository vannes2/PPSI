import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaGavel, FaHome } from "react-icons/fa";
import axios from "axios";

const EditPengacara = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [pengacara, setPengacara] = useState({
    nama: "",
    email: "",
    no_hp: "",
    spesialisasi: "",
    pengalaman: "",
    pendidikan: "",
    tanggal_daftar: "",
  });

  useEffect(() => {
    const fetchPengacaraById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pengacara/${id}`);
        setPengacara(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengacara:", error);
      }
    };

    if (id) {
      fetchPengacaraById();
    }
  }, [id]);

  const handleChange = (e) => {
    setPengacara({ ...pengacara, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/pengacara/${id}`, pengacara);
      alert("Data pengacara berhasil diperbarui!");
      navigate("/HomeAdmin"); 
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
    }
  };

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
          <li>
            <Link to="/HomeAdmin" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaGavel className="mr-2" /> Pengacara
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content p-4 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Edit Pengacara</h2>
        
        {!pengacara.nama && <p>Memuat data...</p>}
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-lg">
          <input
            type="text"
            name="nama"
            value={pengacara.nama}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Nama"
          />
          <input
            type="email"
            name="email"
            value={pengacara.email}
            onChange={handleChange}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              marginBottom: "16px",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid black")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
          />
          <input
            type="text"
            name="no_hp"
            value={pengacara.no_hp}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="No HP"
          />
          <input
            type="text"
            name="spesialisasi"
            value={pengacara.spesialisasi}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Spesialisasi"
          />
          <br></br>
          <input
            type="text"
            name="pengalaman"
            value={pengacara.pengalaman}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Pengalaman"
          />
          <br></br>
          <input
            type="text"
            name="pendidikan"
            value={pengacara.pendidikan}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Pendidikan"
          />
          <br></br>
          
          <input
            type="date"
            name="tanggal_daftar"
            value={
                pengacara.tanggal_daftar
                ? new Date(pengacara.tanggal_daftar).toISOString().split("T")[0] 
                : ""
            }
            onChange={(e) => {
                setPengacara({ ...pengacara, tanggal_daftar: e.target.value });
            }}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tanggal Daftar"
            />

          <div><br></br></div>
          <div className="mt-4">
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 text-lg rounded-md transition duration-300 w-full"
                >
                Simpan Perubahan
            </button>
        </div>
        </form>
      </main>
    </div>
  );
};

export default EditPengacara;
