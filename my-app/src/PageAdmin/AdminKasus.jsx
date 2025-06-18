import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/AdminKasus.css";

const STATUS_OPTIONS = ["Menunggu", "Diproses", "Selesai"];

const defaultForm = {
  user_id: "",
  nama: "",
  email: "",
  noHp: "",
  areaPraktik: "",
  jenisPengerjaan: "",
  biayaMin: "",
  biayaMax: "",
  estimasiSelesai: "",
  lokasi: "",
  deskripsi: "",
  status: "Menunggu",
  lawyer_id: "",
  bukti: null,
};

const AdminKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchName, setSearchName] = useState("");

  // Form & modal state untuk edit
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal state untuk tambah kasus
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch semua kasus
  const fetchKasus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/kasus");
      if (!res.ok) throw new Error("Gagal mengambil data kasus");
      const data = await res.json();
      setKasusList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKasus();
  }, []);

  // Handler input untuk form (edit dan add)
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bukti") {
      setForm({ ...form, bukti: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit form add / edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.user_id || !form.nama || !form.email) {
      setFormError("User ID, Nama, dan Email wajib diisi.");
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    try {
      if (editingId) {
        // Update kasus
        const res = await fetch(`http://localhost:5000/api/kasus/${editingId}`, {
          method: "PUT",
          body: formData,
        });
        if (!res.ok) throw new Error("Gagal mengupdate kasus");
        setIsEditModalOpen(false);
      } else {
        // Tambah kasus baru
        const res = await fetch("http://localhost:5000/api/kasus", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Gagal menambah kasus");
        setIsAddModalOpen(false);
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchKasus();
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Buka modal edit dan isi form
  const handleEdit = (kasus) => {
    setEditingId(kasus.id);
    setForm({
      user_id: kasus.user_id,
      nama: kasus.nama,
      email: kasus.email,
      noHp: kasus.no_hp,
      areaPraktik: kasus.area_praktik,
      jenisPengerjaan: kasus.jenis_pengerjaan,
      biayaMin: kasus.biaya_min,
      biayaMax: kasus.biaya_max,
      estimasiSelesai: kasus.estimasi_selesai?.split("T")[0] || "",
      lokasi: kasus.lokasi,
      deskripsi: kasus.deskripsi,
      status: kasus.status,
      lawyer_id: kasus.lawyer_id || "",
      bukti: null,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
    setForm(defaultForm);
    setFormError(null);
  };

  // Buka modal tambah kasus baru (kosongkan form)
  const handleOpenAddModal = () => {
    setForm(defaultForm);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setForm(defaultForm);
    setFormError(null);
  };

  // Hapus kasus
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kasus ini?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/kasus/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus kasus");
      fetchKasus();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter dan cari
  const filteredKasus = kasusList.filter((k) => {
    const statusMatch = filterStatus === "Semua" || k.status === filterStatus;
    const searchMatch = k.nama.toLowerCase().includes(searchName.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Pisah kasus status Menunggu dan selainnya
  const kasusMenunggu = filteredKasus.filter((k) => k.status === "Menunggu");
  const kasusLainnya = filteredKasus.filter((k) => k.status !== "Menunggu");

  if (loading)
    return (
      <AdminLayout>
        <div className="loading">Memuat data kasus...</div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="error">Error: {error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="admin-kasus-container">
        <h2>Kelola Data Kasus</h2>

        {/* Filter & Search */}
        <div className="filter-search">
          <select
            aria-label="Filter Status Kasus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="search"
            aria-label="Cari Nama Pengaju Kasus"
            placeholder="Cari nama pengaju..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* Tombol Tambah Kasus Baru */}
          <button className="btn-primary btn-add" onClick={handleOpenAddModal}>
            + Tambah Kasus
          </button>
        </div>

        {/* Tabel Kasus Menunggu */}
        <h3 className="table-title">Kasus Menunggu</h3>
        {kasusMenunggu.length === 0 ? (
          <p className="no-data">Tidak ada kasus dengan status Menunggu.</p>
        ) : (
          <div className="table-wrapper">
            <TableKasus data={kasusMenunggu} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}

        {/* Tabel Kasus Lainnya */}
        <h3 className="table-title">Kasus Lainnya</h3>
        {kasusLainnya.length === 0 ? (
          <p className="no-data">Tidak ada kasus dengan status selain Menunggu.</p>
        ) : (
          <div className="table-wrapper">
            <TableKasus data={kasusLainnya} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}

        {/* Modal Edit Kasus */}
        {isEditModalOpen && (
          <EditModal
            form={form}
            onChange={handleInputChange}
            onClose={handleCancelEdit}
            onSubmit={handleSubmit}
            formError={formError}
          />
        )}

        {/* Modal Tambah Kasus Baru */}
        {isAddModalOpen && (
          <AddModal
            form={form}
            onChange={handleInputChange}
            onClose={handleCancelAdd}
            onSubmit={handleSubmit}
            formError={formError}
          />
        )}
      </div>
    </AdminLayout>
  );
};

const TableKasus = ({ data, onEdit, onDelete }) => (
  <table className="admin-kasus-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>User ID</th>
        <th>Nama</th>
        <th>Email</th>
        <th>No HP</th>
        <th>Area Praktik</th>
        <th>Jenis Pengerjaan</th>
        <th>Biaya Min</th>
        <th>Biaya Max</th>
        <th>Estimasi Selesai</th>
        <th>Lokasi</th>
        <th>Status</th>
        <th>Nama Pengacara</th>
        <th>Bukti</th>
        <th>Tanggal Pengajuan</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      {data.map((kasus) => (
        <tr key={kasus.id}>
          <td data-label="ID">{kasus.id}</td>
          <td data-label="User ID">{kasus.user_id}</td>
          <td data-label="Nama">{kasus.nama}</td>
          <td data-label="Email">{kasus.email}</td>
          <td data-label="No HP">{kasus.no_hp}</td>
          <td data-label="Area Praktik">{kasus.area_praktik}</td>
          <td data-label="Jenis Pengerjaan">{kasus.jenis_pengerjaan}</td>
          <td data-label="Biaya Min">{kasus.biaya_min.toLocaleString("id-ID")}</td>
          <td data-label="Biaya Max">{kasus.biaya_max.toLocaleString("id-ID")}</td>
          <td data-label="Estimasi Selesai">{kasus.estimasi_selesai}</td>
          <td data-label="Lokasi">{kasus.lokasi}</td>
          <td data-label="Status">
            <span className={`status-badge status-${kasus.status.toLowerCase()}`}>
              {kasus.status}
            </span>
          </td>
          <td data-label="Nama Pengacara">{kasus.nama_pengacara ?? "-"}</td>
          <td data-label="Bukti">
            {kasus.bukti ? (
              <a
                href={`http://localhost:5000/uploads/${kasus.bukti}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat
              </a>
            ) : (
              "-"
            )}
          </td>
          <td data-label="Tanggal Pengajuan">
            {new Date(kasus.created_at).toLocaleString("id-ID")}
          </td>
          <td data-label="Aksi">
            <button className="btn-action btn-edit" onClick={() => onEdit(kasus)}>
              Edit
            </button>
            <button className="btn-action btn-delete" onClick={() => onDelete(kasus.id)}>
              Hapus
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Reuse komponen form field untuk tambah dan edit
const FormFields = ({ form, onChange }) => (
  <>
    <div className="input-row">
      <div className="input-group">
        <label>User ID *</label>
        <input
          type="number"
          name="user_id"
          value={form.user_id}
          onChange={onChange}
          required
          placeholder="ID Pengguna"
        />
      </div>

      <div className="input-group">
        <label>Nama *</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={onChange}
          required
          placeholder="Nama Pengaju"
        />
      </div>

      <div className="input-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
          placeholder="Email Pengaju"
        />
      </div>

      <div className="input-group">
        <label>No HP</label>
        <input
          type="text"
          name="noHp"
          value={form.noHp}
          onChange={onChange}
          placeholder="No HP"
        />
      </div>

      <div className="input-group">
        <label>Area Praktik</label>
        <input
          type="text"
          name="areaPraktik"
          value={form.areaPraktik}
          onChange={onChange}
          placeholder="Area Praktik"
        />
      </div>

      <div className="input-group">
        <label>Jenis Pengerjaan</label>
        <input
          type="text"
          name="jenisPengerjaan"
          value={form.jenisPengerjaan}
          onChange={onChange}
          placeholder="Jenis Pengerjaan"
        />
      </div>

      <div className="input-group">
        <label>Biaya Min</label>
        <input
          type="number"
          name="biayaMin"
          value={form.biayaMin}
          onChange={onChange}
          placeholder="Biaya Minimum"
        />
      </div>

      <div className="input-group">
        <label>Biaya Max</label>
        <input
          type="number"
          name="biayaMax"
          value={form.biayaMax}
          onChange={onChange}
          placeholder="Biaya Maksimum"
        />
      </div>

      <div className="input-group">
        <label>Estimasi Selesai</label>
        <input
          type="date"
          name="estimasiSelesai"
          value={form.estimasiSelesai}
          onChange={onChange}
        />
      </div>

      <div className="input-group">
        <label>Lokasi</label>
        <input
          type="text"
          name="lokasi"
          value={form.lokasi}
          onChange={onChange}
          placeholder="Lokasi Kasus"
        />
      </div>

      <div className="input-group">
        <label>Deskripsi</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={onChange}
          placeholder="Deskripsi Kasus"
        />
      </div>

      <div className="input-group">
        <label>Status</label>
        <select name="status" value={form.status} onChange={onChange}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Lawyer ID</label>
        <input
          type="number"
          name="lawyer_id"
          value={form.lawyer_id}
          onChange={onChange}
          placeholder="ID Pengacara (opsional)"
        />
      </div>

      <div className="input-group">
        <label>Bukti (File)</label>
        <input type="file" name="bukti" onChange={onChange} />
      </div>
    </div>
  </>
);


// Modal Edit Kasus
const EditModal = ({ form, onChange, onClose, onSubmit, formError }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="editKasusTitle">
    <div className="modal-content">
      <h3 id="editKasusTitle">Edit Kasus</h3>
      <form onSubmit={onSubmit} encType="multipart/form-data" noValidate>
        <FormFields form={form} onChange={onChange} />
        {formError && <p className="form-error">{formError}</p>}
        <div className="form-buttons modal-buttons">
          <button type="submit" className="btn-primary">
            Simpan Perubahan
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Modal Tambah Kasus Baru
const AddModal = ({ form, onChange, onClose, onSubmit, formError }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="addKasusTitle">
    <div className="modal-content">
      <h3 id="addKasusTitle">Tambah Kasus Baru</h3>
      <form onSubmit={onSubmit} encType="multipart/form-data" noValidate>
        <FormFields form={form} onChange={onChange} />
        {formError && <p className="form-error">{formError}</p>}
        <div className="form-buttons modal-buttons">
          <button type="submit" className="btn-primary">
            Tambah Kasus
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AdminKasus;
