import { useState } from "react";
import "./ChatBot.css";

const ChatBotWidget = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Halo! Tanyakan tentang hukum seperti 'KDRT', 'perceraian', dll." }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");

    const res = await fetch("http://localhost:5000/api/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    setMessages(prev => [...prev, { sender: "bot", text: data.response }]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <div className="chatbot-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ketik pesan..." />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
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