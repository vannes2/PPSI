import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/FaqAdmin.css";

const initialForm = {
  intent: "",
  kategori: "",
  keywords: [],
  contoh_pertanyaan: "",
  response: "",
  sumber_referensi: "",
};

const FaqAdmin = () => {
  const [faqData, setFaqData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchFAQ = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faq");
      setFaqData(res.data);
    } catch (err) {
      console.error("Gagal memuat data FAQ:", err);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const parseKeywords = (keywordsStr) => {
    if (!keywordsStr) return [];
    try {
      const arr = JSON.parse(keywordsStr);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    const arr = value.split(",").map((k) => k.trim()).filter(k => k.length > 0);
    setForm((prev) => ({ ...prev, keywords: arr }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!form.intent || !form.response) {
      setErrorMsg("Intent dan Respon wajib diisi.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/faq/${editId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/faq", form);
      }
      resetForm();
      fetchFAQ();
    } catch (error) {
      console.error("Gagal menyimpan FAQ:", error);
      setErrorMsg("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq.id);
    setForm({
      intent: faq.intent,
      kategori: faq.kategori || "",
      keywords: parseKeywords(faq.keywords),
      contoh_pertanyaan: faq.contoh_pertanyaan || "",
      response: faq.response || "",
      sumber_referensi: faq.sumber_referensi || "",
    });
    setErrorMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus FAQ ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/faq/${id}`);
      if (editId === id) resetForm();
      fetchFAQ();
    } catch (error) {
      console.error("Gagal menghapus FAQ:", error);
      alert("Gagal menghapus FAQ.");
    }
  };

  return (
    <AdminLayout>
      <div className="faq-admin-container">
        <h2>Manajemen FAQ Hukum</h2>

        <form onSubmit={handleSubmit} className="faq-form">
          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          <div>
            <label>Intent*</label>
            <input
              name="intent"
              value={form.intent}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Kategori</label>
            <input
              name="kategori"
              value={form.kategori}
              onChange={handleInputChange}
              placeholder="Misal: pidana, perdata, keluarga"
            />
          </div>

          <div>
            <label>Keywords (pisah dengan koma)</label>
            <input
              name="keywords"
              value={form.keywords.join(", ")}
              onChange={handleKeywordsChange}
              placeholder="kdrt, kekerasan dalam rumah tangga"
            />
          </div>

          <div>
            <label>Contoh Pertanyaan</label>
            <textarea
              name="contoh_pertanyaan"
              value={form.contoh_pertanyaan}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          <div>
            <label>Respon*</label>
            <textarea
              name="response"
              value={form.response}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div>
            <label>Sumber Referensi</label>
            <input
              name="sumber_referensi"
              value={form.sumber_referensi}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <button type="submit">{editId ? "Update FAQ" : "Tambah FAQ"}</button>
            {editId && (
              <button type="button" onClick={resetForm} className="btn-cancel">
                Batal
              </button>
            )}
          </div>
        </form>

        <table className="faq-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Intent</th>
              <th>Kategori</th>
              <th>Keyword</th>
              <th>Contoh Pertanyaan</th>
              <th>Respon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {faqData.length > 0 ? (
              faqData.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.id}</td>
                  <td>{faq.intent}</td>
                  <td>{faq.kategori || "-"}</td>
                  <td>
                    {(() => {
                      try {
                        const arr = JSON.parse(faq.keywords);
                        return Array.isArray(arr) ? arr.join(", ") : "-";
                      } catch {
                        return "-";
                      }
                    })()}
                  </td>
                  <td>{faq.contoh_pertanyaan || "-"}</td>
                  <td>{faq.response}</td>
                  <td>
                    <button onClick={() => handleEdit(faq)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(faq.id)} className="btn-delete">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Tidak ada data FAQ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default FaqAdmin;
