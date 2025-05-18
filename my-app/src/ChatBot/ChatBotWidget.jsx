import { useState, useEffect, useRef } from "react";
import chatBg from "../assets/dewa.jpeg";
import avatarImg from "../assets/botchat.png"; // Pastikan path benar
import "./ChatBot.css";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Halo! Saya Lexa, asisten virtual Anda dalam bidang hukum.\nTanyakan apa saja tentang peraturan, kasus, atau konsultasi hukum.\nSaya siap membantu Anda kapan saja.",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.sender === "bot") {
        setHasNewMessage(true);
      }
    }
  }, [messages, isOpen]);

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
    } catch {
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

  const messagesStyle = {
    backgroundImage: `url(${chatBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          aria-label="Buka Chatbot"
          onClick={() => setIsOpen(true)}
        >
          <img src={avatarImg} alt="Avatar Chatbot" />
          {hasNewMessage && <span className="chatbot-message-bubble">Halo! Saya Lexa, asisten virtual</span>}
        </button>
      )}

      {isOpen && (
        <div
          className="chatbot-container"
          role="dialog"
          aria-modal="true"
          aria-label="Chatbot Cerdas Hukum"
        >
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
            tabIndex={0}
            aria-live="polite"
            aria-atomic="false"
          >

            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                <div className="msg-text">{msg.text}</div>
                <div className="msg-time">{formatTime(msg.time)}</div>
              </div>
            ))}

            <div ref={messagesEndRef} />

            {loading && (
              <div className="msg bot loading" aria-live="off" aria-hidden="true">
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

/*update kode dari gw vannes

import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

const ChatBotWidget = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Tanyakan tentang hukum seperti 'KDRT', 'perceraian', dll." },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const chatbotRef = useRef(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Drag handler untuk mouse dan touch
  useEffect(() => {
    const move = (x, y) => {
      const el = chatbotRef.current;
      if (!el) return;

      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      el.style.left = Math.max(0, Math.min(x, maxX)) + "px";
      el.style.top = Math.max(0, Math.min(y, maxY)) + "px";
    };

    const handleMove = (e) => {
      if (!draggingRef.current || !chatbotRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (e.cancelable) e.preventDefault(); // ✅ cegah scroll halaman saat drag

      move(clientX - offsetRef.current.x, clientY - offsetRef.current.y);
    };

    const stopDrag = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const startDrag = (e) => {
    const el = chatbotRef.current;
    if (!el) return;

    draggingRef.current = true;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = el.getBoundingClientRect();

    offsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Maaf, terjadi kesalahan." }]);
    }
  };

  return (
    <div
      className={`chatbot-container ${isMinimized ? "minimized" : ""}`}
      ref={chatbotRef}
      style={{
        position: "fixed",
        left: "20px",
        top: "20px",
        zIndex: 9999,
      }}
    >
      <div
        className="chatbot-header"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <span>Chatbot Cerdas Hukum</span>
        <button
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? "▲" : "▼"}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Kirim</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBotWidget;


*/