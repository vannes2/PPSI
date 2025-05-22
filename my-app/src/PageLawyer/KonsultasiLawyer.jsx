import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaLocationArrow, FaPaperclip } from "react-icons/fa";
import HeaderLawyer from "../components/HeaderLawyer";
import SnackbarNotification from "../components/SnackbarNotification"; // sesuaikan path
import "../CSS_Lawyer/KonsultasiLawyer.css";

const socket = io("http://localhost:5000");

const KonsultasiLawyer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const lawyer = JSON.parse(localStorage.getItem("user"));

  // Ambil sesi konsultasi
  const fetchSession = async (userId, pengacaraId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/konsultasi-session/session/${userId}/${pengacaraId}`
      );
      if (!res.ok) throw new Error("Sesi konsultasi tidak ditemukan");
      const sessionData = await res.json();

      const start = new Date(sessionData.start_time).getTime();
      const now = Date.now();
      const totalDurationMs = sessionData.duration * 60 * 1000;
      const elapsed = now - start;
      const remaining = Math.max(0, Math.floor((totalDurationMs - elapsed) / 1000));

      setSession(sessionData);
      setRemainingTime(remaining);
      setIsLocked(remaining === 0);
    } catch {
      setSession(null);
      setRemainingTime(0);
      setIsLocked(true);
    }
  };

  useEffect(() => {
    if (!lawyer) return;

    // Tampilkan notifikasi saat halaman load
    setShowNotification(true);
    const notifTimer = setTimeout(() => setShowNotification(false), 7000);

    const fetchContacts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/chat/contacts/lawyer/${lawyer.id}`
        );
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error("Gagal ambil kontak:", err);
      }
    };

    fetchContacts();

    const handleReceiveMessage = async (data) => {
      if (!selectedUser) return;

      const isForThisChat = data.sender_id === selectedUser.id;

      if (isForThisChat) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/chat/messages/user/${selectedUser.id}?userId=${lawyer.id}&userRole=pengacara`
          );
          const newMessages = await res.json();
          setMessages(newMessages);
        } catch (err) {
          console.error("Gagal refresh pesan:", err);
        }
      }

      fetchContacts();
    };

    socket.on(`receive_message_pengacara_${lawyer.id}`, handleReceiveMessage);

    return () => {
      socket.off(`receive_message_pengacara_${lawyer.id}`, handleReceiveMessage);
      clearTimeout(notifTimer);
    };
  }, [lawyer?.id, selectedUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setIsLocked(true);
      return;
    }
    const timerId = setInterval(() => {
      setRemainingTime((time) => {
        if (time <= 1) {
          clearInterval(timerId);
          setIsLocked(true);
          alert("Waktu konsultasi telah habis.");
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);

  const loadMessages = async (user) => {
    setSelectedUser(user);
    await fetchSession(user.id, lawyer.id);

    fetch(
      `http://localhost:5000/api/chat/messages/user/${user.id}?userId=${lawyer.id}&userRole=pengacara`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((input.trim() === "" && !selectedFile) || !selectedUser || isLocked) return;

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("sender_id", lawyer.id);
        formData.append("sender_role", "pengacara");
        formData.append("receiver_id", selectedUser.id);
        formData.append("receiver_role", "user");
        formData.append("message", input || "");

        const res = await fetch("http://localhost:5000/api/chat/send-message-file", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: data.id,
              sender_id: lawyer.id,
              sender_role: "pengacara",
              receiver_id: selectedUser.id,
              receiver_role: "user",
              message: input,
              file: data.file,
              timestamp: new Date(),
              is_read: 0,
            },
          ]);
          setInput("");
          setSelectedFile(null);
        } else {
          alert("Gagal mengirim file");
        }
      } else {
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
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim pesan");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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

  const formatRemainingTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
              <div className="chat-header">
                {selectedUser.name}
                <div
                  style={{
                    marginLeft: "15px",
                    fontWeight: "bold",
                    color: isLocked ? "gray" : "red",
                    fontSize: "16px",
                  }}
                >
                  Waktu tersisa: {formatRemainingTime(remainingTime)}
                </div>
              </div>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender_role === "pengacara" ? "sent" : "received"}`}>
                    <div>
                      {msg.message}
                      {msg.file && (
                        <>
                          {/\.(jpg|jpeg|png|gif)$/i.test(msg.file) ? (
                            <img
                              src={`http://localhost:5000/uploads/chat_files/${msg.file}`}
                              alt="gambar"
                              style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "8px" }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div style={{ marginTop: "8px" }}>
                              <a href={`http://localhost:5000/uploads/chat_files/${msg.file}`} target="_blank" rel="noopener noreferrer">
                                📎 {msg.file}
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="time">
                      {formatClock(msg.timestamp)} • {formatTime(msg.timestamp)}
                    </div>
                    {msg.sender_role === "pengacara" && <div className="status">{msg.is_read ? "Dibaca" : "Terkirim"}</div>}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
              {isLocked ? (
                <div style={{ padding: "10px", textAlign: "center" }}></div>
              ) : (
                <form className="chat-input" onSubmit={handleSubmit}>
                  <div className="input-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={isLocked ? "Waktu konsultasi habis" : "Tulis pesan..."} disabled={isLocked} style={{ flex: 1 }} />
                    <label htmlFor="file-upload" style={{ cursor: "pointer", marginRight: "6px" }} title="Upload file">
                      <FaPaperclip size={24} />
                    </label>
                    <input id="file-upload" type="file" style={{ display: "none" }} onChange={handleFileChange} ref={fileInputRef} disabled={isLocked} />
                    <button type="submit" className="btn btn-success" disabled={isLocked} title="Kirim pesan">
                      <FaLocationArrow />
                    </button>
                  </div>
                  {selectedFile && (
                    <div style={{ marginTop: "4px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>File siap dikirim: {selectedFile.name}</span>
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: "red",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        title="Batalkan file"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </form>
              )}
            </>
          ) : (
            <div className="no-chat">Pilih user untuk memulai chat</div>
          )}
        </div>
      </div>

      {/* Snackbar Notification */}
      <SnackbarNotification
        message="Harap lengkapi nomor rekening bank Anda di halaman profil."
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default KonsultasiLawyer;
