import { useEffect, useState, useRef } from "react";
import { useParams,} from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import "../CSS_User/ChatPage.css";

const RiwayatChatPage = () => {
  const { lawyerId: initialLawyerId } = useParams();

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [advokat, setAdvokat] = useState(null);
  const [activeLawyerId, setActiveLawyerId] = useState(initialLawyerId || null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAllProfiles = async () => {
    const res = await fetch("http://localhost:5000/api/profilpengacara");
    return await res.json();
  };

  useEffect(() => {
    if (!user) {
      setError("User belum login.");
      return;
    }

    fetch(`http://localhost:5000/api/chat/contacts/user/${user.id}`)
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
          }
        }
      })
      .catch(() => setError("Gagal mengambil data"));
  }, [user?.id, initialLawyerId]);

  useEffect(() => {
    if (activeLawyerId && !advokat) {
      fetch("http://localhost:5000/api/profilpengacara")
        .then((res) => res.json())
        .then((profiles) => {
          const found = profiles.find((lawyer) => lawyer.id === parseInt(activeLawyerId));
          if (found) {
            setAdvokat(found);
          }
        });
    }
  }, [activeLawyerId, advokat]);

  useEffect(() => {
    if (!activeLawyerId) return;

    fetch(`http://localhost:5000/api/chat/messages/pengacara/${activeLawyerId}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
  }, [activeLawyerId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleContactClick = (lawyer) => {
    setActiveLawyerId(lawyer.id);
    setAdvokat(lawyer);

    fetch(`http://localhost:5000/api/chat/messages/pengacara/${lawyer.id}?userId=${user.id}&userRole=user`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError("Gagal mengambil pesan"));
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
                <li
                  key={lawyer.id}
                  onClick={() => handleContactClick(lawyer)}
                  className={activeLawyerId === lawyer.id ? "active" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <div className="contact-photo">
                    {lawyer.upload_foto ? (
                      <img
                        className="contact-photo-img"
                        src={`http://localhost:5000/uploads/${lawyer.upload_foto}`}
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
                  <div className="last-message">Klik untuk lihat riwayat chat</div>
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
                    src={`http://localhost:5000/uploads/${advokat.upload_foto}`}
                    alt={advokat.nama}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="photo-placeholder">Tidak ada foto</div>
                )}
                Riwayat Chat dengan {advokat?.nama || "Pengacara"}
              </div>
            ) : (
              "Pilih Pengacara untuk melihat riwayat chat"
            )}
          </div>

          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.sender_role === "user" ? "sent" : "received"}`}
                >
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
                            <a
                              href={`http://localhost:5000/uploads/chat_files/${msg.file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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
                  {/* Status pesan dihilangkan karena hanya read-only */}
                </div>
              ))
            ) : (
              <div className="no-messages">Belum ada pesan</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatChatPage;
