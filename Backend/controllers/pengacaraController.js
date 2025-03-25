import db from "../config/db.js";

// Ambil semua data pengacara
export const getAllPengacara = async () => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar FROM pengacara"
    );
    console.log("Data dikembalikan ke frontend:", rows); // Debugging log
    return rows;
  } catch (error) {
    console.error("Error mengambil data pengacara:", error);
    return [];
  }
};

// Ambil pengacara berdasarkan ID
export const getPengacaraById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar FROM pengacara WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error mengambil pengacara by ID:", error);
    return null;
  }
};

// Tambah pengacara baru
export const createPengacara = async (pengacara) => {
  const { nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar } = pengacara;
  try {
    const [result] = await db.query(
      "INSERT INTO pengacara (nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error menambahkan pengacara:", error);
    return null;
  }
};

// Update data pengacara
export const updatePengacara = async (id, pengacara) => {
  const { nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar } = pengacara;
  try {
    await db.query(
      "UPDATE pengacara SET nama = ?, email = ?, no_hp = ?, spesialisasi = ?, pengalaman = ?, pendidikan = ?, tanggal_daftar = ? WHERE id = ?",
      [nama, email, no_hp, spesialisasi, pengalaman, pendidikan, tanggal_daftar, id]
    );
  } catch (error) {
    console.error("Error mengupdate pengacara:", error);
  }
};

// Hapus pengacara berdasarkan ID
export const deletePengacara = async (id) => {
  try {
    await db.query("DELETE FROM pengacara WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error menghapus pengacara:", error);
  }
};
