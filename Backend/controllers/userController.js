const User = require("../models/userModel");

exports.getProfileById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error saat mengambil data profil:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getProfileByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error saat mengambil data profil:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
