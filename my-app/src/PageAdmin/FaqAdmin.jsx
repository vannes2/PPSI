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

  // Filter dan search states
  const [searchPertanyaan, setSearchPertanyaan] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");

  // Ambil daftar kategori unik dari data FAQ untuk dropdown filter
  const uniqueCategories = Array.from(
    new Set(faqData.map((f) => f.kategori).filter((k) => k && k.trim() !== ""))
  );

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
    const arr = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    setForm((prev) => ({ ...prev, keywords: arr }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  // Filter dan search logic
  const filteredFaq = faqData.filter((faq) => {
    const contohLower = (faq.contoh_pertanyaan || "").toLowerCase();
    const matchesSearch = contohLower.includes(searchPertanyaan.toLowerCase());

    const matchesKategori = filterKategori
      ? (faq.kategori || "").toLowerCase() === filterKategori.toLowerCase()
      : true;

    const faqKeywords = parseKeywords(faq.keywords).map((k) => k.toLowerCase());
    const filterKeywordLower = filterKeyword.toLowerCase().trim();
    const matchesKeyword = filterKeywordLower
      ? faqKeywords.some((k) => k.includes(filterKeywordLower))
      : true;

    return matchesSearch && matchesKategori && matchesKeyword;
  });

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

        {/* Filter & Search di bawah form */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search contoh pertanyaan..."
            value={searchPertanyaan}
            onChange={(e) => setSearchPertanyaan(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 300px" }}
          />

          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 200px" }}
          >
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter keyword (ex: kdrt)"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 200px" }}
          />

          <button
            type="button"
            onClick={() => {
              setSearchPertanyaan("");
              setFilterKategori("");
              setFilterKeyword("");
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Reset Filter
          </button>
        </div>

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
            {filteredFaq.length > 0 ? (
              filteredFaq.map((faq) => (
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
