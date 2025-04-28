import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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

        // Ambil nama pengacara dari API
        fetch(`http://localhost:5000/api/pengacara/${contactId}`)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil data pengacara");
                return res.json();
            })
            .then(data => setContactName(data.nama))
            .catch(err => setError(err.message));

        // Ambil histori chat
        fetch(`http://localhost:5000/api/chat/messages/${contactRole}/${contactId}?userId=${user.id}&userRole=${user.role}`)
            .then(res => {
                if (!res.ok) throw new Error("Gagal mengambil pesan");
                return res.json();
            })
            .then(data => setMessages(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

        // Emit mark_read ke socket
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

    if (loading) return <p>Loading chat...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat dengan {contactName || `${contactRole} ID ${contactId}`}</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.length > 0 ? messages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.sender_id == user.id ? "right" : "left", margin: "10px 0" }}>
                        <div style={{ display: "inline-block", background: "#f1f1f1", padding: "8px", borderRadius: "5px" }}>
                            {msg.message}
                        </div>
                    </div>
                )) : <p>Tidak ada pesan.</p>}
            </div>
            <div style={{ marginTop: "10px" }}>
                <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Tulis pesan..." 
                    style={{ width: "80%", padding: "8px" }} 
                />
                <button onClick={sendMessage} style={{ padding: "8px 16px" }}>Kirim</button>
            </div>
        </div>
    );
};

export default ChatPage;
