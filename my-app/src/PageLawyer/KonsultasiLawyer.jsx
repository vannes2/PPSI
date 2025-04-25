import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_Lawyer/KonsultasiLawyer.css'; 

const socket = io('http://localhost:3001'); // default koneksi ke backend sama origin

const KonsultasiLawyer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    let name = localStorage.getItem('chatUsername');
    if (!name) {
      name = prompt('Masukkan nama anda:');
      localStorage.setItem('chatUsername', name);
    }
    setUsername(name);
    socket.emit('set username', name);
  
    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    return () => {
      socket.off('chat message');
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <div className="about-page-container">
      {/* Header */}
      <HeaderLawyer />
      <br/><br/><br/><br/><br/><br/><br/><br/>
      {/* Chat Container */}
      <div className="chat-container">
      <br/><br/><br/><br/>
        <ul id="messages">
          {messages.map((data, index) => {
            const isSelf = data.username === username;

            if (data.username === 'System') {
              return (
                <li key={index} className="system">
                  <div className="system-text">{data.message}</div>
                  <div className="time">{data.time}</div>
                </li>
              );
            } else {
              return (
                <li key={index} className={`chat-message ${isSelf ? 'self' : ''}`}>
                  {!isSelf && (
                    <img
                      className="avatar"
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.username}`}
                      alt={data.username}
                    />
                  )}
                  <div className="bubble">
                    {!isSelf && <div className="name">{data.username}</div>}
                    <div className="text">{data.message}</div>
                    <div className="bubble-footer">
                      <span className="time">{data.time}</span>
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <br/><br/><br/><br/><br/><br/><br/><br/>
      {/* Footer */}
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default KonsultasiLawyer;
