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
