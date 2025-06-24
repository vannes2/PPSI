import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaLocationArrow, FaPaperclip } from "react-icons/fa";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/ChatPage.css";

const socket = io("https://ppsi-production.up.railway.app");

const ChatPage = () => {
  const { lawyerId: initialLawyerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [advokat, setAdvokat] = useState(null);
  const [activeLawyerId, setActiveLawyerId] = useState(initialLawyerId || null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [session, setSession] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const fetchAllProfiles = async () => {
    const res = await fetch("https://ppsi-production.up.railway.app/api/profilpengacara");
    return await res.json();
  };

  const fetchSession = async (userId, pengacaraId) => {
    try {
      const res = await fetch(`https://ppsi-production.up.railway.app/api/konsultasi-session/session/${userId}/${pengacaraId}`);
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
    if (!user) {
      setError("User belum login.");
      return;
    }

    fetch(`https://ppsi-production.up.railway.app/api/chat/contacts/user/${user.id}`)
      .then((res) => res.json())
      .then(async (data) => {
        const profiles = await fetchAllProfiles();
        const updatedContacts = data.map((contact) => {
          const profile = profiles.find((p) => p.id === contact.id);
          return profile ? { ...contact, ...profile } : contact;
        });
        setContacts(updatedContacts);

        if (initialLawyerId) {
          const selected = profiles.find((p) => p.id.toString() === initialLawyerId);
          if (selected) {
            setAdvokat(selected);
            setActiveLawyerId(selected.id);
            await fetchSession(user.id, selected.id);
          }
        }
      })
      .catch(() => setError("Gagal mengambil data"));
  }, [user?.id, initialLawyerId]);

  useEffect(() => {
    if (activeLawyerId && !advokat) {
      fetch("https://ppsi-production.up.railway.app/api/profilpengacara")
        .then((res) => res.json())
        .then(async (profiles) => {
          const found = profiles.find((lawyer) => lawyer.id === parseInt(activeLawyerId));
          if (found) {
            setAdvokat(found);
            await fetchSession(user.id, found.id);
          }
        });
    }
  }, [activeLawyerId, advokat]);

  useEffect(() => {
    if (!activeLawyerId) return;

    fetch(`https://ppsi-production.up.railway.app/api/chat/messages/pengacara/${activeLawyerId}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  }, [activeLawyerId, user?.id]);

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

  useEffect(() => {
  if (!user) return;

  const handleReceiveMessage = async (data) => {
    const isForThisChat =
      data.sender_id.toString() === activeLawyerId?.toString() &&
      data.receiver_id === user.id &&
      data.receiver_role === "user";

    if (isForThisChat) {
      try {
        const res = await fetch(
          `https://ppsi-production.up.railway.app/api/chat/messages/pengacara/${activeLawyerId}?userId=${user.id}&userRole=user`
        );
        const dataMessages = await res.json();
        setMessages(dataMessages);
      } catch (err) {
        console.error("Gagal refresh pesan:", err);
      }
    }

    try {
      const resContacts = await fetch(
        `https://ppsi-production.up.railway.app/api/chat/contacts/user/${user.id}`
      );
      const dataContacts = await resContacts.json();

      const resProfiles = await fetch("https://ppsi-production.up.railway.app/api/profilpengacara");
      const profiles = await resProfiles.json();

      const mergedContacts = dataContacts.map((c) => {
        const profile = profiles.find((p) => p.id === c.id);
        return profile ? { ...c, ...profile } : c;
      });

      setContacts(mergedContacts);
    } catch (err) {
      console.error("Gagal refresh kontak:", err);
    }
  };

  socket.on("receive_message", handleReceiveMessage);

  return () => {
    socket.off("receive_message", handleReceiveMessage);
  };
}, [activeLawyerId, user?.id]);


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((input.trim() === "" && !selectedFile) || !activeLawyerId || isLocked) return;

    try {
      if (selectedFile) {
        // Kirim file lewat FormData
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("sender_id", user.id);
        formData.append("sender_role", "user");
        formData.append("receiver_id", activeLawyerId);
        formData.append("receiver_role", "pengacara");
        formData.append("message", input || "");

        const res = await fetch("https://ppsi-production.up.railway.app/api/chat/send-message-file", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: data.id,
              sender_id: user.id,
              sender_role: "user",
              receiver_id: activeLawyerId,
              receiver_role: "pengacara",
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
        // Kirim pesan teks biasa via socket
        const msgData = {
          sender_id: user.id,
          sender_role: "user",
          receiver_id: activeLawyerId,
          receiver_role: "pengacara",
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

  const handleContactClick = async (lawyer) => {
    setActiveLawyerId(lawyer.id);
    setAdvokat(lawyer);

    await fetchSession(user.id, lawyer.id);

    fetch(`https://ppsi-production.up.railway.app/api/chat/messages/pengacara/${lawyer.id}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  };

  const formatRemainingTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInDays = (now - time) / (1000 * 60 * 60 * 24);
    if (diffInDays < 1) return "Hari ini";
    if (diffInDays < 7) return time.toLocaleDateString("id-ID", { weekday: "long" });
    return time.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatClock = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="chat-app" style={{ backgroundColor: "#fff" }}>
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
                <li key={lawyer.id} onClick={() => handleContactClick(lawyer)} className={activeLawyerId === lawyer.id ? "active" : ""}>
                  <div className="contact-photo">
                    {lawyer.upload_foto ? (
                      <img
                        className="contact-photo-img"
                        src={`https://ppsi-production.up.railway.app/uploads/${lawyer.upload_foto}`}
                        alt={lawyer.nama}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="photo-placeholder">Tidak ada foto</div>
                    )}
                  </div>
                  <div className="contact-name">{lawyer.nama}</div>
                  <div className="last-message">Klik untuk lihat chat</div>
                </li>
              ))
            ) : (
              <li className="no-contact">Belum ada kontak</li>
            )}
          </ul>
        </div>

        <div className="chat-window">
          <div className="chat-header">
            {activeLawyerId ? (
              <div className="chat-header-info">
                {advokat?.upload_foto ? (
                  <img
                    className="lawyer-photo"
                    src={`https://ppsi-production.up.railway.app/uploads/${advokat.upload_foto}`}
                    alt={advokat.nama}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="photo-placeholder">Tidak ada foto</div>
                )}
                Chat dengan {advokat?.nama || "Pengacara"}
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
            ) : (
              "Pilih Pengacara untuk Memulai Chat"
            )}
          </div>

          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender_role === "user" ? "sent" : "received"}`}>
                  <div>
                    {msg.message}
                    {msg.file && (
                      <>
                        {/* Cek ekstensi file gambar untuk tampilkan preview */}
                        {/\.(jpg|jpeg|png|gif)$/i.test(msg.file) ? (
                          <img
                            src={`https://ppsi-production.up.railway.app/uploads/chat_files/${msg.file}`}
                            alt="gambar"
                            style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "8px" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div style={{ marginTop: "8px" }}>
                            <a href={`https://ppsi-production.up.railway.app/uploads/chat_files/${msg.file}`} target="_blank" rel="noopener noreferrer">
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
                  {msg.sender_role === "user" && <div className="status">{msg.is_read ? "Dibaca" : "Terkirim"}</div>}
                </div>
              ))
            ) : (
              <div className="no-messages">Belum ada pesan</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {isLocked ? (
            <div style={{ padding: "10px", textAlign: "center",  }}>
              <button className="Konsul" onClick={() => navigate("/payment", { state: { pengacaraId: activeLawyerId } })}>
                Konsultasi Lagi
              </button>
            </div>
          ) : (
            activeLawyerId && (
              <form className="chat-input" onSubmit={handleSubmit}>
                <div className="input-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLocked ? "Waktu konsultasi habis" : "Tulis pesan..."}
                    className="form-control"
                    disabled={isLocked}
                    style={{ flex: 1 }}
                  />
                  <label
                    htmlFor="file-upload"
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Upload file"
                  >
                    <FaPaperclip size={24} />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isLocked}
                  />
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLocked}
                    title="Kirim pesan"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;