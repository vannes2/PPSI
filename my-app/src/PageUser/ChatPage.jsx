import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import HeaderLawyer from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/ChatPage.css";

const socket = io("http://localhost:5000");

const ChatPage = () => {
    const { contactRole, contactId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [contactName, setContactName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/api/pengacara/${contactId}`)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil data pengacara");
                return res.json();
            })
            .then(data => setContactName(data.nama))
            .catch(err => setError(err.message));

        fetch(`http://localhost:5000/api/chat/messages/${contactRole}/${contactId}?userId=${user.id}&userRole=${user.role}`)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil pesan");
                return res.json();
            })
            .then(data => setMessages(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

        socket.emit('mark_read', {
            receiver_id: user.id,
            receiver_role: user.role,
            sender_id: contactId,
            sender_role: contactRole
        });

        socket.on(`receive_message_${user.role}_${user.id}`, (data) => {
            if (data.sender_id == contactId && data.sender_role == contactRole) {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => socket.off(`receive_message_${user.role}_${user.id}`);
    }, [contactId, contactRole, user, navigate]);

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        const messageData = {
            sender_id: user.id,
            sender_role: user.role,
            receiver_id: contactId,
            receiver_role: contactRole,
            message: newMessage
        };

        socket.emit('send_message', messageData);
        setMessages([...messages, { ...messageData, timestamp: new Date() }]);
        setNewMessage("");
    };

    if (loading) return <p className="status-message">Loading chat...</p>;
    if (error) return <p className="status-message error">Error: {error}</p>;

    return (
        <>
            <HeaderLawyer />
            <div className="chat-wrapper">
                <h2>Chat dengan {contactName || `${contactRole} ID ${contactId}`}</h2>
                <div className="chat-box">
                    {messages.length > 0 ? messages.map((msg, idx) => (
                        <div className={`message ${msg.sender_id == user.id ? "sent" : "received"}`}>
    <div className="bubble">
        {msg.message}
    </div>
</div>

                    )) : <p className="no-message">Tidak ada pesan.</p>}
                </div>
                <div className="input-area">
                    <input 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Tulis pesan..." 
                    />
                    <button onClick={sendMessage}>Kirim</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChatPage;
