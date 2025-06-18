import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/AdminReview.css";

/* ───── Komponen Bintang ───── */
const StarRating = ({ rating }) => (
  <div className="star-rating">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < rating ? "#ffc107" : "#3d566e" }}>
        &#9733;
      </span>
    ))}
  </div>
);

/* ───── Halaman Admin Review ───── */
const AdminReviewPage = () => {
  /* ---------- STATE ---------- */
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", komentar: "" });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    pengacara_id: "",
    user_id: "",
    rating: 5,
    komentar: "",
  });

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews/all", {
          signal: controller.signal,
        });
        setAllReviews(res.data);
      } catch (err) {
        if (err.name !== "CanceledError") setError("Gagal memuat data ulasan.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  /* ---------- HANDLER TAMBAH ---------- */
  const handleNewChange = (e) =>
    setNewReview({ ...newReview, [e.target.name]: e.target.value });

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.pengacara_id || !newReview.user_id) {
      return alert("Silakan isi ID Pengacara & ID Pengguna.");
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/reviews/admin-create",
        newReview
      );
      setAllReviews([data.review, ...allReviews]);
      setShowAddForm(false);           // ← tutup form
      setNewReview({ pengacara_id: "", user_id: "", rating: 5, komentar: "" });
      alert("Ulasan berhasil ditambahkan!");
    } catch {
      alert("Gagal menambahkan ulasan.");
    }
  };

  /* ---------- HANDLER EDIT ---------- */
  const handleEditClick = (rv) => {
    setEditingId(rv.id);
    setEditForm({ rating: rv.rating, komentar: rv.komentar || "" });
  };

  const handleEditChange = (e) =>
    setEditForm({
      ...editForm,
      [e.target.name]:
        e.target.name === "rating" ? +e.target.value : e.target.value,
    });

  const handleUpdateSubmit = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/reviews/${id}`,
        editForm
      );
      setAllReviews(
        allReviews.map((rv) => (rv.id === id ? { ...rv, ...data.review } : rv))
      );
      setEditingId(null);
      alert("Ulasan berhasil diperbarui.");
    } catch {
      alert("Gagal memperbarui ulasan.");
    }
  };

  const handleCancel = () => setEditingId(null);

  /* ---------- HANDLER DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setAllReviews(allReviews.filter((rv) => rv.id !== id));
      alert("Ulasan berhasil dihapus.");
    } catch {
      alert("Gagal menghapus ulasan.");
    }
  };

  /* ---------- FILTER PENCARIAN ---------- */
  const filtered = allReviews.filter((rv) => {
    const t = searchTerm.toLowerCase();
    return (
      rv.komentar?.toLowerCase().includes(t) ||
      rv.user_name?.toLowerCase().includes(t) ||
      rv.pengacara_name?.toLowerCase().includes(t)
    );
  });

  /* ---------- UI LOADING / ERROR ---------- */
  if (loading)
    return (
      <AdminLayout>
        <div className="loading-state">Memuat data...</div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="error-state">{error}</div>
      </AdminLayout>
    );

  /* ---------- RENDER ---------- */
  return (
    <AdminLayout>
      <div className="admin-review-container">
        <h1>Manajemen Ulasan Pengacara</h1>

        {/* ===== Search & Add ===== */}
        <div className="search-and-actions">
          <input
            className="search-input"
            type="text"
            placeholder="Cari ulasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="add-review-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Tutup Form" : "Tambah Ulasan Baru"}
          </button>
        </div>

        {/* ===== Form Tambah (tampil jika showAddForm) ===== */}
        {showAddForm && (
          <div className="add-form-container">
            <h3>Form Tambah Ulasan</h3>
            <form onSubmit={handleNewSubmit}>
              <div className="form-grid">
                <input
                  type="number"
                  name="pengacara_id"
                  placeholder="ID Pengacara"
                  value={newReview.pengacara_id}
                  onChange={handleNewChange}
                  required
                />
                <input
                  type="number"
                  name="user_id"
                  placeholder="ID Pengguna"
                  value={newReview.user_id}
                  onChange={handleNewChange}
                  required
                />
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={handleNewChange}
                />
              </div>
              <textarea
                name="komentar"
                placeholder="Tulis komentar..."
                rows="3"
                value={newReview.komentar}
                onChange={handleNewChange}
              />
              <button type="submit">Simpan Ulasan</button>
            </form>
          </div>
        )}

        {/* ===== Tabel (tampil hanya jika form TIDAK aktif) ===== */}
        {!showAddForm && (
          <div
            className="table-container"
            style={{ height: "70vh", minHeight: "600px" }}
          >
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>PENGACARA</th>
                    <th>PENGGUNA</th>
                    <th>RATING</th>
                    <th>KOMENTAR</th>
                    <th>TANGGAL</th>
                    <th>AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((rv) => (
                    <tr key={rv.id}>
                      <td>{rv.id}</td>
                      <td>{rv.pengacara_name}</td>
                      <td>{rv.user_name}</td>

                      <td>
                        {editingId === rv.id ? (
                          <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            value={editForm.rating}
                            onChange={handleEditChange}
                            style={{ width: 60 }}
                          />
                        ) : (
                          <StarRating rating={rv.rating} />
                        )}
                      </td>

                      <td className="comment-cell">
                        {editingId === rv.id ? (
                          <textarea
                            name="komentar"
                            rows="3"
                            value={editForm.komentar}
                            onChange={handleEditChange}
                          />
                        ) : (
                          rv.komentar || "-"
                        )}
                      </td>

                      <td>
                        {new Date(rv.tanggal_review).toLocaleDateString("id-ID")}
                      </td>

                      <td className="action-cell">
                        {editingId === rv.id ? (
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="save-button"
                              onClick={() => handleUpdateSubmit(rv.id)}
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={handleCancel}
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => handleEditClick(rv)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handleDelete(rv.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Baris kosong agar tabel penuh 6 baris */}
                  {Array.from({ length: Math.max(0, 6 - filtered.length) }).map(
                    (_, i) => (
                      <tr key={`empty-${i}`} className="empty-row">
                        <td colSpan="7">&nbsp;</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Menampilkan {filtered.length} dari {allReviews.length} ulasan
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviewPage;
