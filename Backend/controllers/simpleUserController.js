const SimpleUser = require("../models/simpleUserModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await SimpleUser.getAll();
    res.json(users);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await SimpleUser.deleteById(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await SimpleUser.updateById(req.params.id, req.body);
    res.json({ message: "User updated" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.addUser = async (req, res) => {
  try {
    console.log("Body:", req.body);
    await SimpleUser.create(req.body);
    res.json({ message: "User added" });
  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ message: "Error adding user" });
  }
};
