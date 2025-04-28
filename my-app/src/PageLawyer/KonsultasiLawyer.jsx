import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaLocationArrow } from "react-icons/fa";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_Lawyer/KonsultasiLawyer.css";

const socket = io("http://localhost:5000");

const KonsultasiLawyer = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const lawyer = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!lawyer) {
      setError("Pengacara belum login.");
      return;
    }

    fetch(`http://localhost:5000/api/chat/contacts/lawyer/${lawyer.id}`)
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch(() => setError("Gagal mengambil kontak"));

    socket.on(`receive_message_pengacara_${lawyer.id}`, (data) => {
      if (selectedUser && data.sender_id == selectedUser.id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off();
  }, [lawyer?.id, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = (user) => {
    setSelectedUser(user);
    fetch(`http://localhost:5000/api/chat/messages/user/${user.id}?userId=${lawyer.id}&userRole=pengacara`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "" || !selectedUser) return;

    const msgData = {
      sender_id: lawyer.id,
      sender_role: "pengacara",
      receiver_id: selectedUser.id,
      receiver_role: "user",
      message: input,
    };
    socket.emit("send_message", msgData);
    setMessages([...messages, { ...msgData, timestamp: new Date() }]);
    setInput("");
  };

  return (
    <div className="chat-app">
      <HeaderLawyer />
      {error && <div className="error-message">{error}</div>}
      <div className="chat-container">
        <div className="sidebar">
          <div className="search-box">
            <input type="text" placeholder="Cari user..." />
          </div>
          <ul className="contact-list">
            {contacts.map((user) => (
              <li key={user.id} onClick={() => loadMessages(user)} className={selectedUser?.id === user.id ? "active" : ""}>
                <div className="contact-name">{user.name}</div>
                <div className="last-message">Klik untuk lihat chat</div>
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
                  <div key={idx} className={`message ${msg.sender_role === "pengacara" ? "sent" : "received"}`}>
                    {msg.message}
                    <div className="time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input" onSubmit={handleSubmit}>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Tulis pesan..." 
              />
            <button type="submit">
                <FaLocationArrow />
            </button>
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
