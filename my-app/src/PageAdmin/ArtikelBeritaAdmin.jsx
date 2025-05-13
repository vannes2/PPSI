import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from '../components/SidebarAdmin';
import '../CSS_Admin/ArtikelBeritaAdmin.css';

const ArtikelBeritaAdmin = () => {
  const [berita, setBerita] = useState([]);
  const [form, setForm] = useState({ judul: '', isi: '', gambar: null });
  const [editId, setEditId] = useState(null);
  const [topBerita, setTopBerita] = useState([]);
  const [activeTab, setActiveTab] = useState('tambahArtikel');

  useEffect(() => {
    fetchData();
    fetchTopBerita();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/api/artikel-berita')
      .then((res) => setBerita(res.data))
      .catch((err) => console.error('Gagal memuat data:', err));
  };

  const fetchTopBerita = () => {
    axios.get('http://localhost:5000/api/artikel-berita/top')
      .then((res) => setTopBerita(res.data.map((b) => b.id)))
      .catch((err) => console.error('Gagal memuat top berita:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judul', form.judul);
    formData.append('isi', form.isi);
    if (form.gambar) formData.append('gambar', form.gambar);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/artikel-berita/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/artikel-berita', formData);
      }
      setForm({ judul: '', isi: '', gambar: null });
      setEditId(null);
      fetchData();
      fetchTopBerita();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
    }
  };

  const handleEdit = (data) => {
    setForm({ judul: data.judul, isi: data.isi, gambar: null });
    setEditId(data.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/artikel-berita/${id}`);
        fetchData();
        fetchTopBerita();
      } catch (err) {
        console.error('Gagal menghapus data:', err);
      }
    }
  };

  const toggleTop = async (id) => {
    const isTopNow = topBerita.includes(id);
    if (!isTopNow && topBerita.length >= 4) {
      alert('Maksimal 4 berita yang bisa ditandai sebagai slideshow.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/artikel-berita/top/${id}`, {
        top_berita: !isTopNow
      });

      const updated = isTopNow
        ? topBerita.filter((item) => item !== id)
        : [...topBerita, id];

      setTopBerita(updated);
      fetchData();
    } catch (err) {
      console.error('Gagal update top_berita:', err);
    }
  };

  const removeTop = (id) => {
    toggleTop(id);
  };

  const beritaTopList = berita.filter((b) => topBerita.includes(b.id));

  return (
    <div id="admin-artikel-berita" className="admin-page-layout">
      <SidebarAdmin activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="admin-berita-container">
        <h2>Kelola Artikel & Berita</h2>

        <div className="form-and-top-preview">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              placeholder="Judul"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              required
            />
            <textarea
              placeholder="Isi artikel"
              value={form.isi}
              onChange={(e) => setForm({ ...form, isi: e.target.value })}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, gambar: e.target.files[0] })}
            />
            <button type="submit">{editId ? 'Update' : 'Tambah'} Artikel</button>
          </form>

          <div className="top-preview-container">
            <h3>Top 4 Berita untuk Slideshow</h3>
            {beritaTopList.length === 0 && <p>(Belum ada dipilih)</p>}
            {beritaTopList.map((item) => (
              <div key={item.id} className="top-preview-item">
                <div className="top-preview-item-left">
                  <img src={`http://localhost:5000/uploads/${item.gambar}`} alt={item.judul} />
                  <span>{item.judul}</span>
                </div>
                <button className="remove-top-btn" onClick={() => removeTop(item.id)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="berita-list">
          <div className="tambah-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="tambah-content">
              <div className="plus-icon">+</div>
              <div>Tambah Artikel</div>
            </div>
          </div>

          {berita.map((b) => (
            <div className="berita-item" key={b.id}>
              <input
                type="checkbox"
                checked={topBerita.includes(b.id)}
                onChange={() => toggleTop(b.id)}
                title="Tandai sebagai top berita"
                className="top-checkbox"
              />
              {b.gambar && (
                <img src={`http://localhost:5000/uploads/${b.gambar}`} alt={b.judul || 'Gambar Artikel'} />
              )}
              <div>
                <h4>{b.judul}</h4>
                <p>{b.isi?.slice(0, 100)}...</p>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtikelBeritaAdmin;
