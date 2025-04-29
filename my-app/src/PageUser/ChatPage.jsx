import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaLocationArrow } from "react-icons/fa";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/ChatPage.css";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setError("User belum login.");
      return;
    }

    fetch(`http://localhost:5000/api/chat/contacts`)
      .then((res) => res.json())
      .then((data) => {
        const pengacaraOnly = data.filter((c) => c.role === "pengacara");
        setContacts(pengacaraOnly);
      })
      .catch(() => setError("Gagal mengambil kontak"));

    socket.on(`receive_message_user_${user.id}`, (data) => {
      if (selectedLawyer && data.sender_id == selectedLawyer.id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off();
  }, [user?.id, selectedLawyer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = (lawyer) => {
    setSelectedLawyer(lawyer);
    fetch(
      `http://localhost:5000/api/chat/messages/pengacara/${lawyer.id}?userId=${user.id}&userRole=user`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "" || !selectedLawyer) return;

    const msgData = {
      sender_id: user.id,
      sender_role: "user",
      receiver_id: selectedLawyer.id,
      receiver_role: "pengacara",
      message: input,
    };
    socket.emit("send_message", msgData);
    setMessages([...messages, { ...msgData, timestamp: new Date() }]);
    setInput("");
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
            {contacts.map((lawyer) => (
              <li
                key={lawyer.id}
                onClick={() => loadMessages(lawyer)}
                className={selectedLawyer?.id === lawyer.id ? "active" : ""}
              >
                <div className="contact-name">{lawyer.name}</div>
                <div className="last-message">Klik untuk lihat chat</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-window">
          {selectedLawyer ? (
            <>
              <div className="chat-header">{selectedLawyer.name}</div>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.sender_role === "user" ? "sent" : "received"}`}
                  >
                    {msg.message}
                    <div className="time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
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
            <div className="no-chat">Pilih pengacara untuk memulai chat</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;