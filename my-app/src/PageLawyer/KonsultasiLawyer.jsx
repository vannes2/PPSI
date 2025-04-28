import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_Lawyer/KonsultasiLawyer.css';

const socket = io('http://localhost:5000');

const KonsultasiLawyer = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const lawyer = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!lawyer) {
      setError("Pengacara belum login.");
      return;
    }

    fetch(`http://localhost:5000/api/chat/contacts/lawyer/${lawyer.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil kontak");
        return res.json();
      })
      .then(data => setContacts(data))
      .catch(err => setError(err.message));

    socket.on(`receive_message_pengacara_${lawyer.id}`, (data) => {
      if (selectedUser && data.sender_id == selectedUser.id) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => socket.disconnect();
  }, [lawyer?.id, selectedUser]);

  const loadMessages = (user) => {
    setSelectedUser(user);
    fetch(`http://localhost:5000/api/chat/messages/user/${user.id}?userId=${lawyer.id}&userRole=pengacara`)
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil pesan");
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => setError(err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '' || !selectedUser) return;

    const msgData = {
      sender_id: lawyer.id,
      sender_role: 'pengacara',
      receiver_id: selectedUser.id,
      receiver_role: 'user',
      message: input
    };
    socket.emit('send_message', msgData);
    setMessages([...messages, { ...msgData, timestamp: new Date() }]);
    setInput('');
  };

  return (
    <div className="chat-app">
      <HeaderLawyer />
      {error && <div style={{color: "red", textAlign: "center"}}>{error}</div>}
      <div className="chat-container">
        <div className="sidebar">
          <div className="search-box">
            <input type="text" placeholder="Search or start a new chat" />
          </div>
          <ul className="contact-list">
            {contacts.map(user => (
              <li key={user.id} onClick={() => loadMessages(user)} className={selectedUser?.id === user.id ? 'active' : ''}>
                <div className="contact-name">{user.name}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-window">
          {selectedUser ? (
            <>
              <div className="chat-header">{selectedUser.name}</div>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender_role === 'pengacara' ? 'sent' : 'received'}`}>
                    {msg.message}
                    <div className="time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                ))}
              </div>
              <form className="chat-input" onSubmit={handleSubmit}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat">Pilih user untuk memulai chat</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KonsultasiLawyer;
