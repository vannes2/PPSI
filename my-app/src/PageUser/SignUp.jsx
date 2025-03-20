import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS_User/SignUp.css"; 

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        confirmPassword,
        gender,
        birthdate,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Pendaftaran berhasil");
      navigate("/HomeAfter");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="signup-page">
      <Header />

      <section>
        <div className="signup-title">
          <h1>Buat Akun</h1>
        </div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Masukan Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukan Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Masukan Nomor Telepon Anda"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Masukan Kata Sandi Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-column">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Masukan Konfirmasi Kata Sandi Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <label htmlFor="gender">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    >
                    <option value="" disabled hidden>
                        Pilih Gender
                    </option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                    </select>
              </div>
              <div className="form-column">
                <label htmlFor="birthdate">Birth Date</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  placeholder="Masukan Tanggal Lahir Anda"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="checkbox-label">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms" className="terms">
                Dengan mendaftar ke Ayune, Anda telah menyetujui{" "}
                <a href="#">syarat &amp; ketentuan</a> dan{" "}
                <a href="#">kebijakan privasi</a>
              </label>
            </div>
            <br />
            <button type="submit" className="btn">
              Mendaftar
            </button>
          </form>
        </div>
      </section>

        <div className="footer-separator"></div>
      {/* footer */}
      <Footer />
    </div>
  );
};

export default SignUp;
