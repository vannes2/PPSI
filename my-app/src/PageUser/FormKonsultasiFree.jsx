import { useState } from "react";

// IMPORT BARU UNTUK FUNGSI PDF PREVIEW

import { PDFViewer } from "@react-pdf/renderer";

import LaporanPDF from "./LaporanPDF"; // Pastikan path ini benar

import HeaderAfter from "../components/HeaderAfter";

import Footer from "../components/Footer"; // Impor Footer sudah ada

// Pastikan path CSS Anda benar, sesuaikan jika perlu

import "../CSS_User/FormKonsultasiFree.css";

// Fungsi validasi terpusat (dari kode Anda)

const validateStep = (step, data) => {
  const errors = {};

  if (step === 1) {
    if (!data.nama_korban) errors.nama_korban = "Nama lengkap korban tidak boleh kosong.";

    if (!data.tempat_lahir_korban) errors.tempat_lahir_korban = "Tempat lahir tidak boleh kosong.";

    if (!data.tanggal_lahir_korban) errors.tanggal_lahir_korban = "Tanggal lahir tidak boleh kosong.";

    if (!data.usia_korban) errors.usia_korban = "Usia tidak boleh kosong.";

    if (data.usia_korban && isNaN(data.usia_korban)) errors.usia_korban = "Usia harus berupa angka.";

    if (!data.jenis_kelamin_korban) errors.jenis_kelamin_korban = "Jenis kelamin harus dipilih.";

    if (!data.alamat_ktp_korban) errors.alamat_ktp_korban = "Alamat KTP tidak boleh kosong.";

    if (!data.alamat_domisili_korban) errors.alamat_domisili_korban = "Alamat domisili tidak boleh kosong.";

    if (!data.pekerjaan_korban) errors.pekerjaan_korban = "Pekerjaan tidak boleh kosong.";

    if (!data.pendidikan_korban) errors.pendidikan_korban = "Pendidikan tidak boleh kosong.";

    if (!data.kewarganegaraan_korban) errors.kewarganegaraan_korban = "Kewarganegaraan tidak boleh kosong.";

    if (!data.no_hp_korban || data.no_hp_korban === "+(62) ") errors.no_hp_korban = "No. HP tidak boleh kosong.";
  } else if (step === 2) {
    if (!data.nama_pelaku) errors.nama_pelaku = "Nama lengkap pelaku tidak boleh kosong.";

    if (!data.jenis_kelamin_pelaku) errors.jenis_kelamin_pelaku = "Jenis kelamin harus dipilih.";
  } else if (step === 3) {
    if (!data.tempat_kejadian) errors.tempat_kejadian = "Tempat kejadian tidak boleh kosong.";

    if (!data.waktu_kejadian) errors.waktu_kejadian = "Waktu kejadian tidak boleh kosong.";

    if (!data.kronologi) errors.kronologi = "Kronologi tidak boleh kosong.";
  }

  return errors;
};

// --- Komponen-komponen Form (Korban, Pelaku, Pendukung) ---

const FormKorban = ({ formData, handleChange, handleNext, errors }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="form-group full-width">
        <label htmlFor="jenis-kasus">Jenis kasus</label>
        <select id="jenis-kasus" name="jenis_kasus" value={formData.jenis_kasus} onChange={handleChange}>
          <option value="" disabled>
            Pilih Salah Satu
          </option>
          <option value="kdrt">KDRT</option>
          <option value="pelecehan_seksual">Pelecehan Seksual</option>
          <option value="perkosaan">Perkosaan</option>
          <option value="perbudakan_seksual">Perbudakan Seksual</option>
          <option value="kdp">KDP</option>
          <option value="trafficking">Trafficking</option>
          <option value="lainnya">Lainnya</option>
        </select>
        <div className="sub-label">Tidak Wajib</div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="nama_korban">
          Nama lengkap korban <span className="required">*</span>
        </label>
        <input type="text" id="nama_korban" name="nama_korban" placeholder="Tulis Disini" value={formData.nama_korban} onChange={handleChange} className={errors.nama_korban ? "input-error" : ""} />
        {errors.nama_korban && <p className="error-message">{errors.nama_korban}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tempat_lahir_korban">
            Tempat lahir korban <span className="required">*</span>
          </label>
          <input type="text" id="tempat_lahir_korban" name="tempat_lahir_korban" placeholder="Tulis Disini" value={formData.tempat_lahir_korban} onChange={handleChange} className={errors.tempat_lahir_korban ? "input-error" : ""} />
          {errors.tempat_lahir_korban && <p className="error-message">{errors.tempat_lahir_korban}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="tanggal_lahir_korban">
            Tanggal lahir korban <span className="required">*</span>
          </label>
          <div className="date-input-wrapper">
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              id="tanggal_lahir_korban"
              name="tanggal_lahir_korban"
              placeholder="Pilih Tanggal"
              value={formData.tanggal_lahir_korban}
              onChange={handleChange}
              className={errors.tanggal_lahir_korban ? "input-error" : ""}
            />
          </div>
          {errors.tanggal_lahir_korban && <p className="error-message">{errors.tanggal_lahir_korban}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usia_korban">
            Usia Korban <span className="required">*</span>
          </label>
          <input type="text" id="usia_korban" name="usia_korban" placeholder="Tulis Disini" value={formData.usia_korban} onChange={handleChange} className={errors.usia_korban ? "input-error" : ""} />
          {errors.usia_korban && <p className="error-message">{errors.usia_korban}</p>}
        </div>
        <div className="form-group">
          <label>
            Jenis Kelamin Korban<span className="required">*</span>
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input type="radio" id="laki-laki-korban" name="jenis_kelamin_korban" value="Laki-Laki" checked={formData.jenis_kelamin_korban === "Laki-Laki"} onChange={handleChange} />
              <label htmlFor="laki-laki-korban">Laki-Laki</label>
            </div>
            <div className="radio-option">
              <input type="radio" id="perempuan-korban" name="jenis_kelamin_korban" value="Perempuan" checked={formData.jenis_kelamin_korban === "Perempuan"} onChange={handleChange} />
              <label htmlFor="perempuan-korban">Perempuan</label>
            </div>
          </div>
          {errors.jenis_kelamin_korban && <p className="error-message">{errors.jenis_kelamin_korban}</p>}
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="alamat_ktp_korban">
          Alamat sesuai KTP korban <span className="required">*</span>
        </label>
        <input type="text" id="alamat_ktp_korban" name="alamat_ktp_korban" placeholder="Tulis Disini" value={formData.alamat_ktp_korban} onChange={handleChange} className={errors.alamat_ktp_korban ? "input-error" : ""} />
        {errors.alamat_ktp_korban && <p className="error-message">{errors.alamat_ktp_korban}</p>}
      </div>

      <div className="form-group full-width">
        <label htmlFor="alamat_domisili_korban">
          Alamat domisili/ tempat tinggal saat ini <span className="required">*</span>
        </label>
        <input
          type="text"
          id="alamat_domisili_korban"
          name="alamat_domisili_korban"
          placeholder="Tulis Disini"
          value={formData.alamat_domisili_korban}
          onChange={handleChange}
          className={errors.alamat_domisili_korban ? "input-error" : ""}
        />
        {errors.alamat_domisili_korban && <p className="error-message">{errors.alamat_domisili_korban}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="agama_korban">Agama/ kepercayaan</label>
          <select id="agama_korban" name="agama_korban" value={formData.agama_korban} onChange={handleChange}>
            <option value="" disabled>
              Pilih Salah Satu
            </option>
            <option value="islam">Islam</option>
            <option value="kristen">Kristen</option>
            <option value="katolik">Katolik</option>
            <option value="hindu">Hindu</option>
            <option value="buddha">Buddha</option>
            <option value="khonghucu">Khonghucu</option>
          </select>
          <div className="sub-label">Tidak Wajib</div>
        </div>
        <div className="form-group">
          <label htmlFor="pekerjaan_korban">
            Pekerjaan Korban <span className="required">*</span>
          </label>
          <input type="text" id="pekerjaan_korban" name="pekerjaan_korban" placeholder="Tulis Disini" value={formData.pekerjaan_korban} onChange={handleChange} className={errors.pekerjaan_korban ? "input-error" : ""} />
          {errors.pekerjaan_korban && <p className="error-message">{errors.pekerjaan_korban}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pendidikan_korban">
            Pendidikan terakhir korban <span className="required">*</span>
          </label>
          <input type="text" id="pendidikan_korban" name="pendidikan_korban" placeholder="Tulis Disini" value={formData.pendidikan_korban} onChange={handleChange} className={errors.pendidikan_korban ? "input-error" : ""} />
          {errors.pendidikan_korban && <p className="error-message">{errors.pendidikan_korban}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="kewarganegaraan_korban">
            Kewarganegaraan <span className="required">*</span>
          </label>
          <input
            type="text"
            id="kewarganegaraan_korban"
            name="kewarganegaraan_korban"
            placeholder="Tulis Disini"
            value={formData.kewarganegaraan_korban}
            onChange={handleChange}
            className={errors.kewarganegaraan_korban ? "input-error" : ""}
          />
          {errors.kewarganegaraan_korban && <p className="error-message">{errors.kewarganegaraan_korban}</p>}
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="no_hp_korban">
          No HP/ TLP Korban <span className="required">*</span>
        </label>
        <input type="text" id="no_hp_korban" name="no_hp_korban" value={formData.no_hp_korban} onChange={handleChange} className={errors.no_hp_korban ? "input-error" : ""} />
        {errors.no_hp_korban && <p className="error-message">{errors.no_hp_korban}</p>}
      </div>

      <div className="button-container">
        <button type="submit" className="next-btn">
          Next
        </button>
      </div>
    </form>
  );
};

const FormPelaku = ({ formData, handleChange, handleNext, handleBack, errors }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <div className="form-group full-width">
        <label htmlFor="nama_pelaku">
          Nama lengkap Pelaku <span className="required">*</span>
        </label>
        <input type="text" id="nama_pelaku" name="nama_pelaku" placeholder="Tulis Disini" value={formData.nama_pelaku} onChange={handleChange} className={errors.nama_pelaku ? "input-error" : ""} />
        {errors.nama_pelaku && <p className="error-message">{errors.nama_pelaku}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tempat_lahir_pelaku">Tempat lahir Pelaku</label>
          <input type="text" id="tempat_lahir_pelaku" name="tempat_lahir_pelaku" placeholder="Tulis Disini" value={formData.tempat_lahir_pelaku} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="tanggal_lahir_pelaku">Tanggal lahir Pelaku</label>
          <div className="date-input-wrapper">
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              id="tanggal_lahir_pelaku"
              name="tanggal_lahir_pelaku"
              placeholder="Pilih Tanggal"
              value={formData.tanggal_lahir_pelaku}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="usia_pelaku">Usia Pelaku</label>
          <input type="text" id="usia_pelaku" name="usia_pelaku" placeholder="Tulis Disini" value={formData.usia_pelaku} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>
            Jenis Kelamin Pelaku <span className="required">*</span>
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input type="radio" id="laki-laki-pelaku" name="jenis_kelamin_pelaku" value="Laki-Laki" checked={formData.jenis_kelamin_pelaku === "Laki-Laki"} onChange={handleChange} />
              <label htmlFor="laki-laki-pelaku">Laki-Laki</label>
            </div>
            <div className="radio-option">
              <input type="radio" id="perempuan-pelaku" name="jenis_kelamin_pelaku" value="Perempuan" checked={formData.jenis_kelamin_pelaku === "Perempuan"} onChange={handleChange} />
              <label htmlFor="perempuan-pelaku">Perempuan</label>
            </div>
          </div>
          {errors.jenis_kelamin_pelaku && <p className="error-message">{errors.jenis_kelamin_pelaku}</p>}
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="alamat_ktp_pelaku">Alamat sesuai KTP Pelaku</label>
        <input type="text" id="alamat_ktp_pelaku" name="alamat_ktp_pelaku" placeholder="Tulis Disini" value={formData.alamat_ktp_pelaku} onChange={handleChange} />
      </div>

      <div className="form-group full-width">
        <label htmlFor="alamat_domisili_pelaku">Alamat domisili/ tempat tinggal saat ini</label>
        <input type="text" id="alamat_domisili_pelaku" name="alamat_domisili_pelaku" placeholder="Tulis Disini" value={formData.alamat_domisili_pelaku} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="agama_pelaku">Agama/ kepercayaan</label>
          <select id="agama_pelaku" name="agama_pelaku" value={formData.agama_pelaku} onChange={handleChange}>
            <option value="" disabled>
              Pilih Salah Satu
            </option>
            <option value="islam">Islam</option>
            <option value="kristen">Kristen</option>
            <option value="katolik">Katolik</option>
            <option value="hindu">Hindu</option>
            <option value="buddha">Buddha</option>
            <option value="khonghucu">Khonghucu</option>
          </select>
          <div className="sub-label">Tidak Wajib</div>
        </div>
        <div className="form-group">
          <label htmlFor="pekerjaan_pelaku">Pekerjaan Pelaku</label>
          <input type="text" id="pekerjaan_pelaku" name="pekerjaan_pelaku" placeholder="Tulis Disini" value={formData.pekerjaan_pelaku} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="pendidikan_pelaku">Pendidikan terakhir Pelaku</label>
        <input type="text" id="pendidikan_pelaku" name="pendidikan_pelaku" placeholder="Tulis Disini" value={formData.pendidikan_pelaku} onChange={handleChange} />
      </div>

      <div className="button-container">
        <button type="button" className="back-btn" onClick={handleBack}>
          Kembali
        </button>
        <button type="submit" className="next-btn">
          Next
        </button>
      </div>
    </form>
  );
};

const FormPendukung = ({ formData, handleChange, handleFileChange, handleSubmit, handleBack, errors }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group full-width">
        <label htmlFor="tempat_kejadian">
          Tempat kejadian kekerasan yang dialami korban <span className="required">*</span>
        </label>
        <input type="text" id="tempat_kejadian" name="tempat_kejadian" placeholder="Tulis Disini" value={formData.tempat_kejadian} onChange={handleChange} className={errors.tempat_kejadian ? "input-error" : ""} />
        {errors.tempat_kejadian && <p className="error-message">{errors.tempat_kejadian}</p>}
      </div>

      <div className="form-group full-width">
        <label htmlFor="waktu_kejadian">
          Kapan korban mengalami kekerasan <span className="required">*</span>
        </label>
        <input type="text" id="waktu_kejadian" name="waktu_kejadian" placeholder="Tulis Disini" value={formData.waktu_kejadian} onChange={handleChange} className={errors.waktu_kejadian ? "input-error" : ""} />
        {errors.waktu_kejadian && <p className="error-message">{errors.waktu_kejadian}</p>}
      </div>

      <div className="form-group full-width">
        <label htmlFor="kronologi">
          Kronologi kasus yang dialami korban <span className="required">*</span>
        </label>
        <textarea id="kronologi" name="kronologi" placeholder="Tuliskan dengan jelas" value={formData.kronologi} onChange={handleChange} rows="6" className={errors.kronologi ? "input-error" : ""}></textarea>
        {errors.kronologi && <p className="error-message">{errors.kronologi}</p>}
      </div>

      <div className="form-group full-width">
        <label htmlFor="file_kk">Unggah File KK</label>
        <div className="file-upload-wrapper">
          <input type="file" id="file_kk" name="file_kk" onChange={handleFileChange} />
          <label htmlFor="file_kk" className="file-upload-button">
            Choose File
          </label>
          <span className="file-upload-name">{formData.file_kk ? formData.file_kk.name : "No file chosen"}</span>
        </div>
        <div className="sub-label">Ukuran Maksimal 8MB</div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="file_ktp">Unggah File KTP</label>
        <div className="file-upload-wrapper">
          <input type="file" id="file_ktp" name="file_ktp" onChange={handleFileChange} />
          <label htmlFor="file_ktp" className="file-upload-button">
            Choose File
          </label>
          <span className="file-upload-name">{formData.file_ktp ? formData.file_ktp.name : "No file chosen"}</span>
        </div>
        <div className="sub-label">Ukuran Maksimal 8MB</div>
      </div>

      <div className="button-container">
        <button type="button" className="back-btn" onClick={handleBack}>
          Kembali
        </button>
        <button type="submit" className="next-btn submit-btn">
          Kirim Pengaduan
        </button>
      </div>
    </form>
  );
};

// Komponen Utama

const Formulir = () => {
  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    jenis_kasus: "",
    nama_korban: "",
    tempat_lahir_korban: "",
    tanggal_lahir_korban: "",
    usia_korban: "",
    jenis_kelamin_korban: "",
    alamat_ktp_korban: "",
    alamat_domisili_korban: "",
    agama_korban: "",
    pekerjaan_korban: "",
    pendidikan_korban: "",
    kewarganegaraan_korban: "",
    no_hp_korban: "+(62) ",

    nama_pelaku: "",
    tempat_lahir_pelaku: "",
    tanggal_lahir_pelaku: "",
    usia_pelaku: "",
    jenis_kelamin_pelaku: "",
    alamat_ktp_pelaku: "",
    alamat_domisili_pelaku: "",
    agama_pelaku: "",
    pekerjaan_pelaku: "",
    pendidikan_pelaku: "",

    tempat_kejadian: "",
    waktu_kejadian: "",
    kronologi: "",
    file_kk: null,
    file_ktp: null,
  });

  const handleNext = () => {
    const validationErrors = validateStep(step, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateStep(step, formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Mengirim data formulir:", formData);
      alert("Pengaduan Anda berhasil dikirim! Terima kasih.");
      setStep(1);
      setErrors({});
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return <FormKorban formData={formData} handleChange={handleChange} handleNext={handleNext} errors={errors} />;

      case 2:
        return <FormPelaku formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} errors={errors} />;

      case 3:
        return <FormPendukung formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} handleSubmit={handleSubmit} handleBack={handleBack} errors={errors} />;

      default:
        setStep(1);
        return <FormKorban formData={formData} handleChange={handleChange} handleNext={handleNext} errors={errors} />;
    }
  };

  const getStepClassName = (currentStep) => {
    if (step > currentStep) return "step completed";
    if (step === currentStep) return "step active";
    return "step";
  };

  // === STRUKTUR JSX UTAMA YANG BARU DENGAN DUA KOLOM ===

  return (
    // PENAMBAHAN 1: React Fragment sebagai pembungkus utama

    <>
      <div className="main-layout">
        <HeaderAfter />

        <div className="form-panel">
          <div className="form-container">
            <div className="form-body">
              <div className="progress-bar">
                <div className={getStepClassName(1)}>
                  <div className="circle">1</div>
                  <div className="label">Formulir Korban</div>
                </div>

                <div className={getStepClassName(2)}>
                  <div className="circle">2</div>
                  <div className="label">Formulir Pelaku</div>
                </div>

                <div className={getStepClassName(3)}>
                  <div className="circle">3</div>
                  <div className="label">File Pendukung</div>
                </div>
              </div>

              {step === 1 && <h2 className="form-section-title">I. FORM KORBAN</h2>}

              {step === 2 && <h2 className="form-section-title">II. FORM PELAKU</h2>}

              {step === 3 && <h2 className="form-section-title">III. KRONOLOGI & FILE PENDUKUNG</h2>}

              {renderForm()}
            </div>
          </div>
        </div>

        <div className="pdf-panel">
          <PDFViewer width="100%" height="100%" showToolbar={true}>
            <LaporanPDF data={formData} />
          </PDFViewer>
        </div>
      </div>

      <div className="footer-separator" />

      <Footer />
    </>
  );
};

export default Formulir;
