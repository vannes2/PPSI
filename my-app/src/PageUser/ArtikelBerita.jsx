import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS_User/ArtikelBerita.css';
import HeaderAfter from '../components/HeaderAfter';
import Footer from '../components/Footer';

const ArtikelBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [topBerita, setTopBerita] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/artikel-berita')
      .then((res) => setBeritaList(res.data))
      .catch((err) => console.error('Gagal memuat artikel:', err));

    axios.get('http://localhost:5000/api/artikel-berita/top')
      .then((res) => {
        console.log("Top Berita dari API:", res.data);  // PENTING
        setTopBerita(res.data);
      })
      .catch((err) => console.error('Gagal memuat top berita:', err));
  }, []);

  useEffect(() => {
    if (topBerita.length > 0) {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % topBerita.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [topBerita]);

  return (
    <div className="artikel-berita-page">
      <HeaderAfter />
      <br /><br /><br /><br />

      {/* Slideshow */}
      {topBerita.length > 0 && (
        <div className="top-slideshow-section" style={{ border: '2px dashed #ccc' }}>
          <div className="main-highlight">
            <div className="highlight-box fade">
              <img
                src={`http://localhost:5000/uploads/${topBerita[slideIndex]?.gambar || 'default.jpg'}`}
                alt={topBerita[slideIndex]?.judul || 'Top Berita'}
              />
              <div className="highlight-caption">
                <h3>{topBerita[slideIndex]?.judul}</h3>
                <a href={`/DetailBerita/${topBerita[slideIndex]?.id}`}>Lihat Selengkapnya</a>
              </div>
            </div>
          </div>

          <div className="side-articles">
            {topBerita.map((item) => (
              <div className="side-article-item" key={item.id}>
                <img src={`http://localhost:5000/uploads/${item.gambar}`} alt={item.judul} />
                <div className="side-article-info">
                  <a href={`/DetailBerita/${item.id}`}>{item.judul}</a>
                  <span className="label">Berita</span>
                  <span className="time">5 menit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semua Artikel */}
      <div className="artikel-container">
        <h2>Artikel & Berita</h2>
        <div className="berita-grid">
          {beritaList.map((item) => (
            <div className="berita-card" key={item.id}>
              <img src={`http://localhost:5000/uploads/${item.gambar}`} alt={item.judul} />
              <h4>{item.judul}</h4>
              <p>{item.isi?.slice(0, 100)}...</p>
              <a href={`/DetailBerita/${item.id}`} className="btn-detail">Lihat Selengkapnya</a>
            </div>
          ))}
        </div>
      </div>

      <br /><br /><br />
      <Footer />
    </div>
  );
};

export default ArtikelBerita;
