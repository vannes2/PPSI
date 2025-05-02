import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams untuk mengambil parameter dari URL
import io from "socket.io-client";
import { FaLocationArrow } from "react-icons/fa";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/ChatPage.css";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { lawyerId } = useParams(); // Mengambil ID pengacara dari URL
  const [contacts, setContacts] = useState([]); // Menyimpan daftar kontak
  const [messages, setMessages] = useState([]); // Menyimpan pesan
  const [input, setInput] = useState(""); // Input pesan
  const [error, setError] = useState(""); // Menyimpan error jika ada
  const messagesEndRef = useRef(null); // Referensi untuk scroll otomatis ke bawah
  const user = JSON.parse(localStorage.getItem("user")); // Ambil data user dari localStorage

  useEffect(() => {
    if (!user) {
      setError("User belum login.");
      return;
    }

    // Ambil daftar kontak yang pernah dihubungi user
    fetch(`http://localhost:5000/api/chat/contacts/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch(() => setError("Gagal mengambil kontak"));

    // Mendengarkan pesan baru dari pengacara yang dipilih
    socket.on(`receive_message_user_${user.id}`, (data) => {
      if (data.sender_id === parseInt(lawyerId)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off();
  }, [user?.id, lawyerId]);

  useEffect(() => {
    // Mengambil histori chat sebelumnya ketika lawyerId dipilih
    if (!lawyerId) return;

    fetch(`http://localhost:5000/api/chat/messages/pengacara/${lawyerId}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));

  }, [lawyerId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "" || !lawyerId) return;

    const msgData = {
      sender_id: user.id,
      sender_role: "user",
      receiver_id: lawyerId,
      receiver_role: "pengacara",
      message: input,
    };
    socket.emit("send_message", msgData);
    setMessages([...messages, { ...msgData, timestamp: new Date() }]);
    setInput("");
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInDays = (now - time) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return "Hari ini";
    } else if (diffInDays < 7) {
      return time.toLocaleDateString("id-ID", { weekday: "long" });
    } else {
      return time.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const formatClock = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadMessages = (lawyer) => {
    setMessages([]); // Mengosongkan pesan yang ada
    setError(""); // Clear error message
    fetch(`http://localhost:5000/api/chat/messages/pengacara/${lawyer.id}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch(() => setError("Gagal mengambil pesan"));
  };

  return (
    <div className="chat-app">
      <HeaderAfter />
      {error && <div className="error-message">{error}</div>}
      <div className="chat-container">
        <div className="sidebar">
          <div className="search-box">
            <input type="text" placeholder="Cari pengacara..." />
          </div>
          <ul className="contact-list">
            {contacts.length > 0 ? (
              contacts.map((lawyer) => (
                <li
                  key={lawyer.id}
                  onClick={() => loadMessages(lawyer)}
                  className={lawyerId === lawyer.id ? "active" : ""}
                >
                  <div className="contact-name">{lawyer.name}</div>
                  <div className="last-message">Klik untuk lihat chat</div>
                </li>
              ))
            ) : (
              <li className="no-contact">Belum ada kontak</li>
            )}
          </ul>
        </div>

        <div className="chat-window">
          <div className="chat-header">{lawyerId ? "Chat dengan Pengacara" : "Pilih Pengacara untuk Memulai Chat"}</div>
          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.sender_role === "user" ? "sent" : "received"}`}
                >
                  <div>{msg.message}</div>
                  <div className="time">
                    {formatClock(msg.timestamp)} • {formatTime(msg.timestamp)}
                  </div>
                  {msg.sender_role === "user" && (
                    <div className="status">
                      {msg.is_read ? "Dibaca" : "Terkirim"}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-messages">Belum ada pesan</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {lawyerId && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
