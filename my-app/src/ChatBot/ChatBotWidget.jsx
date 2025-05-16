import { useState, useEffect, useRef } from "react";
import chatBg from "../assets/dewa.jpeg";      // Background chat
import avatarImg from "../assets/botchat.png";  // Gambar avatar tombol toggle
import "./ChatBot.css";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! Tanyakan tentang hukum seperti 'KDRT', 'perceraian', dll.",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const now = new Date();

    setMessages((prev) => [...prev, { sender: "user", text: trimmedInput, time: now }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!res.ok) throw new Error("Gagal mendapatkan respons dari server");

      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.response, time: new Date() }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Maaf, terjadi kesalahan. Coba lagi nanti.", time: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  // Style inline untuk background gambar chat
  const messagesStyle = {
    backgroundImage: `url(${chatBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  return (
    <>
      {/* Tombol avatar fixed */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          aria-label="Buka Chatbot"
          onClick={() => setIsOpen(true)}
        >
          <img src={avatarImg} alt="Avatar Chatbot" />
        </button>
      )}

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-container" role="dialog" aria-modal="true" aria-label="Chatbot Cerdas Hukum">
          <div className="chatbot-header">
            <span>Chatbot Cerdas Hukum</span>
            <button
              className="chatbot-close-btn"
              aria-label="Tutup Chatbot"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          <div
            className="chatbot-messages"
            style={messagesStyle}
            tabIndex="0"
            aria-live="polite"
            aria-atomic="false"
          >
            <div className="overlay" />

            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                <div className="msg-text">{msg.text}</div>
                <div className="msg-time">{formatTime(msg.time)}</div>
              </div>
            ))}

            <div ref={messagesEndRef} />

            {loading && (
              <div className="msg bot loading">
                <div className="msg-text">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loading ? "Bot sedang mengetik..." : "Ketik pesan..."}
              aria-label="Input pesan chatbot"
              rows={1}
              spellCheck={false}
              autoComplete="off"
              disabled={loading}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Kirim pesan"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
