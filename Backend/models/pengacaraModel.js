import db from "../config/db.js";

export const getAllPengacara = async () => {
  const [rows] = await db.query("SELECT * FROM pengacara");
  return rows;
};

export const getPengacaraById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pengacara WHERE id = ?", [id]);
  return rows[0];
};

export const createPengacara = async (pengacara) => {
  const { nama, email, no_hp, spesialisasi, pengalaman } = pengacara;
  const [result] = await db.query(
    "INSERT INTO pengacara (nama, email, no_hp, spesialisasi, pengalaman) VALUES (?, ?, ?, ?, ?)",
    [nama, email, no_hp, spesialisasi, pengalaman]
  );
  return result.insertId;
};

export const updatePengacara = async (id, pengacara) => {
  const { nama, email, no_hp, spesialisasi, pengalaman } = pengacara;
  await db.query(
    "UPDATE pengacara SET nama = ?, email = ?, no_hp = ?, spesialisasi = ?, pengalaman = ? WHERE id = ?",
    [nama, email, no_hp, spesialisasi, pengalaman, id]
  );
};

export const deletePengacara = async (id) => {
  await db.query("DELETE FROM pengacara WHERE id = ?", [id]);
};
