import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_Lawyer/RegisterBankAccount.css";
const bankList = [
  "Bank Mandiri",
  "Bank BCA",
  "Bank BRI",
  "Bank BNI",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank BTN",
  "Bank Mega",
  "Bank Syariah Indonesia",
];

const RegisterBankAccount = () => {
  const navigate = useNavigate();

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const lawyer = JSON.parse(localStorage.getItem("user"));

  const validateForm = () => {
    if (!accountName.trim()) {
      setError("Nama rekening wajib diisi");
      return false;
    }
    if (!bankName) {
      setError("Silakan pilih nama bank");
      return false;
    }
    if (!accountNumber) {
      setError("Nomor rekening wajib diisi");
      return false;
    }
    if (!/^\d+$/.test(accountNumber)) {
      setError("Nomor rekening hanya boleh berisi angka");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `https://ppsi-production.up.railway.app/api/pengacara/update-bank/${lawyer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bank_name: bankName,
            account_name: accountName,
            account_number: accountNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan data");
      }

      setSuccessMessage("Data nomor rekening berhasil disimpan!");
      setError("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message);
      setSuccessMessage("");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="register-bank-page">
      <HeaderLawyer />
      <div className="register-container">
        <br/><br/><br/><br/>
        <h1>Tautkan rekening bank Anda</h1>
        <p className="info-text">
          💡 Silakan isi data rekening bank Anda dengan benar untuk memudahkan proses pembayaran konsultasi melalui platform Cerdas Hukum.
        </p>
        <form onSubmit={handleSubmit} className="bank-form" noValidate>
          <div className="form-group">
            <label htmlFor="accountName">Nama Rekening</label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Masukkan nama rekening"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Nama Bank</label>
            <select
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              aria-required="true"
            >
              <option value="" disabled>
                -- Pilih Bank --
              </option>
              {bankList.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Nomor Rekening Bank</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Masukkan nomor rekening"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              aria-required="true"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <small className="note">
              Pastikan nomor rekening yang Anda daftarkan merupakan rekening aktif dan terdaftar di bank resmi di Indonesia.
            </small>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}
          {successMessage && (
            <div className="success-message" role="alert">
              {successMessage}
            </div>
          )}

          <p className="disclaimer">
            Dengan mengisi dan mengonfirmasi data ini, Anda menyatakan bahwa semua informasi yang diberikan adalah benar, valid, dan Anda telah membaca serta menyetujui{" "}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Kebijakan Privasi Cerdas Hukum
            </a>
            .
          </p>

          <div className="btn-group">
            <button
              type="button"
              className="back-btn"
              onClick={handleBack}
              aria-label="Kembali ke halaman sebelumnya"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="confirm-btn"
              aria-label="Konfirmasi data rekening bank"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
      
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default RegisterBankAccount;
