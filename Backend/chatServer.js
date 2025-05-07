const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const db = require("./config/database");

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("send_message", (data) => {
    const { sender_id, sender_role, receiver_id, receiver_role, message } = data;
    db.query("INSERT INTO messages SET ?", { sender_id, sender_role, receiver_id, receiver_role, message }, (err) => {
      if (!err) {
        io.emit(`receive_message_${receiver_role}_${receiver_id}`, data);
      }
    });
  });

  socket.on("mark_read", ({ receiver_id, receiver_role, sender_id, sender_role }) => {
    db.query("UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND receiver_role = ? AND sender_id = ? AND sender_role = ?", [receiver_id, receiver_role, sender_id, sender_role]);
  });
});
