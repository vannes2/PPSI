const db = require("../config/database");

// Ambil harga konsultasi pengacara dari tabel pengacara berdasarkan pengacaraId
const getHargaKonsultasi = (pengacaraId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT harga_konsultasi FROM pengacara WHERE id = ?";
    db.query(sql, [pengacaraId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(0);
      resolve(results[0].harga_konsultasi);
    });
  });
};

// Fungsi buat atau update session konsultasi dengan menyimpan biaya dan biaya_pengacara
const createOrUpdateSession = async (userId, pengacaraId, duration) => {
  try {
    const hargaKonsultasi = await getHargaKonsultasi(pengacaraId);
    // Hitung biaya berdasarkan harga pengacara dan durasi (dalam menit)
    // Misal hargaKonsultasi adalah harga per 30 menit, biaya = hargaKonsultasi * (duration/30)
    const biaya = hargaKonsultasi * (duration / 30);
    // Hitung biaya_pengacara = 80% dari biaya (biaya yang diterima pengacara)
    const biaya_pengacara = biaya * 0.8;

    return new Promise((resolve, reject) => {
      const cekSql = "SELECT * FROM konsultasi_session WHERE user_id = ? AND pengacara_id = ? AND status = 'aktif' LIMIT 1";
      db.query(cekSql, [userId, pengacaraId], (err, results) => {
        if (err) return reject(err);

        const now = new Date();

        if (results.length > 0) {
          // Update start_time, duration, biaya, dan biaya_pengacara session yang sudah ada
          const updateSql = `
            UPDATE konsultasi_session 
            SET start_time = ?, duration = ?, biaya = ?, biaya_pengacara = ?
            WHERE id = ?
          `;
          db.query(updateSql, [now, duration, biaya, biaya_pengacara, results[0].id], (err2) => {
            if (err2) return reject(err2);
            db.query("SELECT * FROM konsultasi_session WHERE id = ?", [results[0].id], (err3, rows) => {
              if (err3) return reject(err3);
              resolve(rows[0]);
            });
          });
        } else {
          // Buat session baru dengan biaya dan biaya_pengacara
          const insertSql = `
            INSERT INTO konsultasi_session 
            (user_id, pengacara_id, start_time, duration, biaya, biaya_pengacara, status)
            VALUES (?, ?, ?, ?, ?, ?, 'aktif')
          `;
          db.query(insertSql, [userId, pengacaraId, now, duration, biaya, biaya_pengacara], (err2, result) => {
            if (err2) return reject(err2);
            db.query("SELECT * FROM konsultasi_session WHERE id = ?", [result.insertId], (err3, rows) => {
              if (err3) return reject(err3);
              resolve(rows[0]);
            });
          });
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Fungsi untuk menandai session selesai jika durasi habis (tidak berubah)
// const finishSessionIfExpired = (sessionId) => {
//   return new Promise((resolve, reject) => {
//     // Ambil data session dulu
//     const selectSql = "SELECT start_time, duration, status FROM konsultasi_session WHERE id = ?";
//     db.query(selectSql, [sessionId], (err, results) => {
//       if (err) return reject(err);
//       if (results.length === 0) return resolve(null);

//       const session = results[0];
//       if (session.status !== 'aktif') return resolve(null); // Jika sudah selesai, abaikan

//       const startTime = new Date(session.start_time);
//       const now = new Date();
//       const diffMs = now - startTime;
//       const diffMinutes = diffMs / 60000;

//       // Jika waktu sudah lewat durasi, update status jadi 'selesai'
//       if (diffMinutes >= session.duration) {
//         const updateSql = "UPDATE konsultasi_session SET status = 'selesai' WHERE id = ?";
//         db.query(updateSql, [sessionId], (err2, result) => {
//           if (err2) return reject(err2);
//           resolve(result);
//         });
//       } else {
//         resolve(null); // Belum habis
//       }
//     });
//   });
// };

// Fungsi untuk mendapatkan session konsultasi aktif (tidak berubah)
const getSession = (userId, pengacaraId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM konsultasi_session WHERE user_id = ? AND pengacara_id = ? AND status = 'aktif' LIMIT 1";
    db.query(sql, [userId, pengacaraId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

// Fungsi getRiwayatByUserId dengan callback (dipakai di controller), sudah termasuk biaya_pengacara
const getRiwayatByUserId = (userId, callback) => {
  const sql = `
    SELECT ks.*, 
           p.id AS id_pengacara, 
           p.nama AS nama_pengacara,
           p.upload_foto AS foto_pengacara,
           p.harga_konsultasi,
           p.nama_rekening,
           p.no_rekening
    FROM konsultasi_session ks
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;
  db.query(sql, [userId], callback);
};



// update Fungsi untuk menandai session selesai//

// Fungsi untuk menandai session selesai jika durasi habis (diperbaiki)
const finishSessionIfExpired = (sessionId) => {
    return new Promise((resolve, reject) => {
        // Ambil data session dulu
        const selectSql = "SELECT start_time, duration, status, user_id, pengacara_id FROM konsultasi_session WHERE id = ?"; // Menambahkan user_id dan pengacara_id untuk diagnosa di masa mendatang jika unik_session melibatkan mereka
        db.query(selectSql, [sessionId], (err, results) => {
            if (err) {
                console.error("Error fetching session details in finishSessionIfExpired (SELECT):", err);
                return reject(err);
            }
            if (results.length === 0) {
                console.log(`Sesi ID ${sessionId} tidak ditemukan.`);
                return resolve(null); // Sesi tidak ditemukan
            }

            // BARIS INI YANG HILANG DAN PERLU DIKEMBALIKAN:
            const session = results[0]; // <<<---- INI PENTING!

            // Jika status sudah selain 'aktif', abaikan update
            if (session.status !== 'aktif') {
                console.log(`Sesi ID ${sessionId} sudah tidak aktif (status: ${session.status}), tidak perlu diupdate.`);
                return resolve(null);
            }

            const startTime = new Date(session.start_time);
            const now = new Date();
            const diffMs = now - startTime;
            const diffMinutes = diffMs / 60000;

            // Jika waktu sudah lewat durasi, update status jadi 'selesai'
            if (diffMinutes >= session.duration) {
                const updateSql = "UPDATE konsultasi_session SET status = 'selesai' WHERE id = ?";
                db.query(updateSql, [sessionId], (err2, result) => {
                    if (err2) {
                        console.error(`Error updating session ID ${sessionId} to 'selesai':`, err2);
                        // Tangani ER_DUP_ENTRY secara spesifik
                        if (err2.code === 'ER_DUP_ENTRY') {
                            console.warn(`ER_DUP_ENTRY detected for session ID ${sessionId} when setting to 'selesai'. This might mean a conflicting entry already exists.`);
                            // Anda bisa memilih untuk resolve sebagai sukses jika tujuan status 'selesai' secara logis sudah tercapai
                            return resolve({ status: 'already_completed_or_conflicting_entry_exists' });
                        }
                        // Untuk error lain, tetap reject
                        return reject(err2);
                    }
                    console.log(`Sesi ID ${sessionId} berhasil diupdate menjadi 'selesai'. Affected rows: ${result.affectedRows}`);
                    resolve(result);
                });
            } else {
                console.log(`Sesi ID ${sessionId} belum habis waktunya.`);
                resolve(null); // Belum habis
            }
        });
    });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    // Query untuk mengambil data dengan join ke tabel pengacara dan user
    const dataSql = `
      SELECT 
        ks.*, 
        p.nama AS nama_pengacara,
        u.name AS nama_user
      FROM konsultasi_session ks
      LEFT JOIN pengacara p ON ks.pengacara_id = p.id
      LEFT JOIN users u ON ks.user_id = u.id
      ORDER BY ks.start_time DESC
    `;

    // Query untuk menghitung total data
    const totalSql = "SELECT COUNT(*) as total FROM konsultasi_session";

    // Menjalankan kedua query secara bersamaan
    db.query(dataSql, (err, data) => {
      if (err) return reject(err);
      db.query(totalSql, (err2, totalResult) => {
        if (err2) return reject(err2);
        resolve({
          data: data,
          total: totalResult[0].total,
        });
      });
    });
  });
};

module.exports = {
  getAll,
  createOrUpdateSession,
  finishSessionIfExpired,
  getSession,
  getRiwayatByUserId
};
