// src/PageLawyer/SelectUser.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLawyer from '../components/HeaderLawyer';
import Footer from '../components/Footer';
import '../CSS_Lawyer/HomeLawyer.css';

const SelectUser = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStartChat = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('chatUsername', name);
      navigate('/konsultasi-lawyer');
    }
  };

  return (
    <div className="about-page-container">
      <HeaderLawyer />
      <div className="chat-container select-user">
        <h2>Masukkan Nama Anda untuk Memulai Chat</h2>
        <form onSubmit={handleStartChat}>
          <input
            type="text"
            placeholder="Nama Anda..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Mulai Chat</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SelectUser;
