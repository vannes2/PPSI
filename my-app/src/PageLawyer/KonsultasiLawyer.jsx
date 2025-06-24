import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaLocationArrow, FaPaperclip } from "react-icons/fa";
import HeaderLawyer from "../components/HeaderLawyer"; // Pastikan path ini benar
import SnackbarNotification from "../components/SnackbarNotification"; // Pastikan path ini benar
import "../CSS_Lawyer/KonsultasiLawyer.css"; // Pastikan path ini benar

const socket = io("https://ppsi-production.up.railway.app");

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
  const [loadingContacts, setLoadingContacts] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const lawyer = JSON.parse(localStorage.getItem("user"));

  const checkBankAccount = async () => {
    try {
      if (!lawyer?.id) {
        setShowNotification(false);
        return;
      }
      const res = await fetch(
        `https://ppsi-production.up.railway.app/api/pengacara/check-bank/${lawyer.id}`
      );
      if (!res.ok) throw new Error("Gagal cek data bank");
      const data = await res.json();
      const { bank_name, account_name, account_number } = data;
      if (!bank_name || !account_name || !account_number) {
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    } catch (error) {
      console.error("Gagal cek data rekening bank:", error);
      setShowNotification(true);
    }
  };

  const fetchSession = async (userId, pengacaraId) => {
    try {
      const res = await fetch(
        `https://ppsi-production.up.railway.app/api/konsultasi-session/session/${userId}/${pengacaraId}`
      );
      if (!res.ok) throw new Error("Sesi konsultasi tidak ditemukan");
      const sessionData = await res.json();
      const start = new Date(sessionData.start_time).getTime();
      const now = Date.now();
      const totalDurationMs = sessionData.duration * 60 * 1000;
      const elapsed = now - start;
      const remaining = Math.max(
        0,
        Math.floor((totalDurationMs - elapsed) / 1000)
      );
      setSession(sessionData);
      setRemainingTime(remaining);
      setIsLocked(remaining === 0);
    } catch {
      setSession(null);
      setRemainingTime(0);
      setIsLocked(true);
    }
  };

  const fetchContactsAndProfiles = async () => {
    if (!lawyer?.id) return;
    setLoadingContacts(true);
    setError("");
    console.log("Memulai fetchContactsAndProfiles untuk lawyer ID:", lawyer.id);

    try {
      const contactsRes = await fetch(
        `https://ppsi-production.up.railway.app/api/chat/contacts/lawyer/${lawyer.id}`
      );
      if (!contactsRes.ok) {
        console.error("Gagal mengambil daftar kontak dasar. Status:", contactsRes.status);
        throw new Error("Gagal mengambil daftar kontak dasar.");
      }
      let initialContacts = await contactsRes.json();
      console.log("Kontak awal (dari /api/chat/contacts/lawyer):", initialContacts);

      if (initialContacts && initialContacts.length > 0) {
        const profilePromises = initialContacts.map(contact =>
          fetch(`https://ppsi-production.up.railway.app/api/profile/id/${contact.id}`)
            .then(response => {
              if (!response.ok) {
                console.warn(`Gagal mengambil profil untuk user ID: ${contact.id}. Status: ${response.status}`);
                return { ...contact, upload_foto: null, _profileError: true };
              }
              return response.json();
            })
            .then(profileData => {
              if (profileData._profileError) return profileData;
              console.log(`Data profil untuk user ID ${contact.id} (dari /api/profile/id):`, profileData);
              
              // === PERUBAHAN PENTING ADA DI SINI ===
              // Menggunakan profileData.photo sesuai dengan output console Anda
              return {
                ...contact,
                upload_foto: profileData.photo || null, // Menggunakan field 'photo'
              };
              // =====================================
            })
            .catch(err => {
              console.error(`Error saat fetch profil untuk user ID: ${contact.id}`, err);
              return { ...contact, upload_foto: null, _fetchError: true };
            })
        );

        const enrichedContacts = await Promise.all(profilePromises);
        console.log("Kontak setelah digabung dengan data profil:", enrichedContacts);
        setContacts(enrichedContacts);
      } else {
        console.log("Tidak ada kontak awal yang ditemukan.");
        setContacts([]);
      }
    } catch (err) {
      console.error("Error keseluruhan di fetchContactsAndProfiles:", err);
      setError(err.message || "Gagal memuat data kontak.");
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (!lawyer?.id) return;
    checkBankAccount();
    fetchContactsAndProfiles();

    const handleReceiveMessage = async (data) => {
      if (selectedUser && data.sender_id === selectedUser.id) {
        try {
          const res = await fetch(
            `https://ppsi-production.up.railway.app/api/chat/messages/user/${selectedUser.id}?userId=${lawyer.id}&userRole=pengacara`
          );
          const newMessages = await res.json();
          setMessages(newMessages);
        } catch (err) {
          console.error("Gagal refresh pesan:", err);
        }
      }
      fetchContactsAndProfiles();
    };

    socket.on(`receive_message_pengacara_${lawyer.id}`, handleReceiveMessage);
    return () => {
      socket.off(`receive_message_pengacara_${lawyer.id}`, handleReceiveMessage);
    };
  }, [lawyer?.id]);

  useEffect(() => {
    // Logika lain jika diperlukan saat selectedUser berubah
  }, [selectedUser?.id]);

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
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const loadMessages = async (user) => {
    setSelectedUser(user);
    await fetchSession(user.id, lawyer.id);
    setError("");
    try {
      const res = await fetch(
        `https://ppsi-production.up.railway.app/api/chat/messages/user/${user.id}?userId=${lawyer.id}&userRole=pengacara`
      );
      if (!res.ok) throw new Error("Gagal mengambil pesan untuk user: " + user.name);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
      setMessages([]);
    }
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
              sender_id: lawyer.id,
              sender_role: "pengacara",
              receiver_id: selectedUser.id,
              receiver_role: "user",
              message: input,
              file: data.file,
              timestamp: data.timestamp || new Date().toISOString(),
              is_read: 0,
            },
          ]);
          setInput("");
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          alert(`Gagal mengirim file: ${data.message || "Error tidak diketahui"}`);
        }
      } else {
        const msgData = {
          sender_id: lawyer.id,
          sender_role: "pengacara",
          receiver_id: selectedUser.id,
          receiver_role: "user",
          message: input,
          timestamp: new Date().toISOString(),
        };
        socket.emit("send_message", msgData);
        setMessages((prevMessages) => [...prevMessages, { ...msgData, is_read: 0 }]);
        setInput("");
      }
    } catch (err) {
      console.error("Error sending message:", err)
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

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    if (isNaN(time.getTime())) return "Invalid date";
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDateStart = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    const diffInDays = Math.floor((todayStart - messageDateStart) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return time.toLocaleDateString("id-ID", { weekday: "long" });
    return time.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatClock = (timestamp) => {
    const time = new Date(timestamp);
    if (isNaN(time.getTime())) return "--:--";
    return time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const formatRemainingTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
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
            {loadingContacts ? (
              <li className="loading-contacts-message">Memuat kontak...</li>
            ) : contacts.length > 0 ? (
              contacts.map((user) => (
                <li
                  key={user.id}
                  onClick={() => loadMessages(user)}
                  className={selectedUser?.id === user.id ? "active" : ""}
                >
                  <div className="contact-photo-container">
                    {user.upload_foto ? ( // Properti 'upload_foto' ini sekarang diisi dari profileData.photo
                      <img
                        src={`https://ppsi-production.up.railway.app/uploads/profile_photos/${user.upload_foto}`}
                        alt={user.name}
                        className="contact-photo-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-user-avatar.png"; // Ganti dengan path default avatar Anda
                        }}
                      />
                    ) : (
                      <div className="contact-photo-placeholder">
                        {user.name ? user.name.substring(0, 1).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  <div className="contact-details">
                    <div className="contact-name">{user.name}</div>
                    <div className="last-message">Klik untuk lihat chat</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-contact-message">Belum ada kontak user.</li>
            )}
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
                  <div
                    key={msg.id || idx}
                    className={`message ${
                      msg.sender_role === "pengacara" ? "sent" : "received"
                    }`}
                  >
                    <div>
                      {msg.message}
                      {msg.file && (
                        <>
                          {/\.(jpg|jpeg|png|gif)$/i.test(msg.file) ? (
                            <img
                              src={`https://ppsi-production.up.railway.app/uploads/chat_files/${msg.file}`}
                              alt="lampiran gambar"
                              style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "8px", cursor: "pointer" }}
                              onClick={() => window.open(`https://ppsi-production.up.railway.app/uploads/chat_files/${msg.file}`, '_blank')}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div style={{ marginTop: "8px" }}>
                              <a href={`https://ppsi-production.up.railway.app/uploads/chat_files/${msg.file}`} target="_blank" rel="noopener noreferrer">
                                📎 {msg.file_original_name || msg.file}
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="time">
                      {formatClock(msg.timestamp)} • {formatTime(msg.timestamp)}
                    </div>
                    {msg.sender_role === "pengacara" && (
                      <div className="status">
                        {msg.is_read ? "Dibaca" : "Terkirim"}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {isLocked ? (
                <div style={{ padding: "10px", textAlign: "center", background:"#f0f2f5", borderTop:"1px solid #d1d7db" }}>
                  <p style={{color: "red", fontWeight: "bold"}}>Waktu konsultasi dengan user ini telah habis.</p>
                </div>
              ) : (
                <form className="chat-input" onSubmit={handleSubmit}>
                  <div className="input-group" style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isLocked ? "Waktu konsultasi habis" : "Tulis pesan..."}
                      disabled={isLocked}
                      className="form-control-chat"
                      style={{ flex: 1 }}
                    />
                    <label htmlFor="file-upload-lawyer" className="chat-file-label" title="Upload file">
                      <FaPaperclip size={22} />
                    </label>
                    <input
                      id="file-upload-lawyer"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      disabled={isLocked}
                    />
                    <button type="submit" className="btn-send-chat" disabled={isLocked || (input.trim() === "" && !selectedFile) } title="Kirim pesan">
                      <FaLocationArrow />
                    </button>
                  </div>
                  {selectedFile && (
                    <div className="selected-file-info">
                      <span>File siap dikirim: {selectedFile.name}</span>
                      <button type="button" onClick={clearSelectedFile} className="btn-clear-file" title="Batalkan file">
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

      <SnackbarNotification
        message="Harap lengkapi nomor rekening bank Anda di halaman profil untuk dapat menerima pembayaran."
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default KonsultasiLawyer;