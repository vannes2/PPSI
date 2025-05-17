import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./PageUser/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./PageUser/AboutUs";
import Login from "./PageUser/Login";
import SignUp from "./PageUser/SignUp";
import HomeAfter from "./PageUser/HomeAfter";
import AboutUsAfter from "./PageUser/AboutUsAfter";
import ProfileEdit from "./PageUser/ProfileEdit";
import ProfileView from "./PageUser/ProfileView";
import Konsultasi from "./PageUser/konsultasi";
import Artikel from "./PageUser/Artikel";
import ArtikelDetail from "./PageUser/ArtikelDetail";
import ChatPage from "./PageUser/ChatPage";
import Payment from "./PageUser/Payment";
import AjukanKasus from "./PageUser/AjukanKasus";
import DaftarKasus from "./PageUser/DaftarKasus";
import ForgotPassword from "./PageUser/ForgotPassword";
import VerifyOtp from "./PageUser/VerifyOtp";
import ResetPassword from "./PageUser/ResetPassword";
import DetailBerita from "./PageUser/DetailBerita";
import RiwayatChatPage from "./PageUser/RiwayatChatPage"

// Admin Pages
import HomeAdmin from "./PageAdmin/HomeAdmin";
import EditPengacara from "./PageAdmin/EditPengacara";
import ViewPengacara from "./PageAdmin/ViewPengacara";
import TambahPengacara from "./PageAdmin/TambahPengacara";
import TambahArtikel from "./PageAdmin/TambahArtikel";
import LawyerRegistrations from "./PageAdmin/LawyerRegistrations";
import ProfilAdmin from "./PageAdmin/ProfilAdmin";
import UserManagement from "./PageAdmin/UserManagement";
import ArtikelBeritaUser from "./PageUser/ArtikelBerita"; 
import ArtikelBeritaAdmin from "./PageAdmin/ArtikelBeritaAdmin"; 
import RiwayatPertanyaanUser from "./PageAdmin/RiwayatPertanyaanUser";
import FaqAdmin from "./PageAdmin/FaqAdmin";

// Lawyer Pages
import RegisterLawyerPage from "./PageLawyer/RegisterLawyerPage";
import HomeLawyer from "./PageLawyer/HomeLawyer";
import ArtikelLawyer from "./PageLawyer/ArtikelLawyer";
import AboutLawyer from "./PageLawyer/AboutLawyer";
import ProfileLawyer from "./PageLawyer/ProfileLawyer";
import KonsultasiLawyer from "./PageLawyer/KonsultasiLawyer";
import SelectUser from "./PageLawyer/selectUser";
import ProfileEditLawyer from "./PageLawyer/ProfileEditLawyer";
import DaftarKasusLawyer from "./PageLawyer/DaftarKasusLawyer";

// BotChat
import ChatBotWidget from "./ChatBot/ChatBotWidget";

// Components
import SidebarAdmin from "./components/SidebarAdmin";
import ScrollToTop from "./components/ScrollToTop";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <Router>
             <ScrollToTop />
              <ChatBotWidget />
            <Routes>
                {/* ✅ Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/Header" element={<Header />} />
                <Route path="/Footer" element={<Footer />} />
                <Route path="/AboutUs" element={<AboutUs />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Artikel" element={<Artikel />} />

                {/* ✅ User Routes */}
                <Route path="/HomeAfter" element={<HomeAfter />} />
                <Route path="/AboutUsAfter" element={<AboutUsAfter />} />
                <Route path="/ProfileEdit" element={<ProfileEdit />} />
                <Route path="/ProfileView" element={<ProfileView />} />
                <Route path="/konsultasi" element={<Konsultasi />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/chat/pengacara/:lawyerId" element={<ChatPage />} />
                <Route path="/chat/:contactRole/:contactId" element={<ChatPage />} /> {/* fallback tambahan jika dibutuhkan */}
                <Route path="/AjukanKasus" element={<AjukanKasus />} />
                <Route path="/DaftarKasus" element={<DaftarKasus />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/ArtikelBerita" element={<ArtikelBeritaUser />} />
                <Route path="/DetailBerita/:id" element={<DetailBerita />} />
                <Route path="/RiwayatChatPage" element={<RiwayatChatPage />} />
                <Route path="/artikel/:id" element={<ArtikelDetail />} />

                {/* ✅ Admin Routes */}
                <Route path="/HomeAdmin" element={<HomeAdmin />} />
                <Route path="/EditPengacara/:id" element={<EditPengacara />} />
                <Route path="/ViewPengacara/:id" element={<ViewPengacara />} />
                <Route path="/TambahPengacara" element={<TambahPengacara />} />
                <Route path="/TambahArtikel" element={<TambahArtikel />} />
                <Route path="/LawyerRegistrations" element={<LawyerRegistrations />} />
                <Route path="/ProfilAdmin" element={<ProfilAdmin />} />
                <Route path="/UserManagement" element={<UserManagement />} />
                <Route path="/SidebarAdmin" element={<SidebarAdmin />} />
                <Route path="/ArtikelBeritaAdmin" element={<ArtikelBeritaAdmin />} />
                <Route path="/log-pertanyaan" element={<RiwayatPertanyaanUser />} />
                <Route path="/faq" element={<FaqAdmin />} />
                

                {/* ✅ Lawyer Routes */}
                <Route path="/RegisterLawyerPage" element={<RegisterLawyerPage />} />
                <Route path="/HomeLawyer" element={<HomeLawyer />} />
                <Route path="/ArtikelLawyer" element={<ArtikelLawyer />} />
                <Route path="/AboutLawyer" element={<AboutLawyer />} />
                <Route path="/ProfileLawyer" element={<ProfileLawyer />} />
                <Route path="/KonsultasiLawyer" element={<KonsultasiLawyer />} />
                <Route path="/SelectUser" element={<SelectUser />} />
                <Route path="/ProfileEditLawyer" element={<ProfileEditLawyer />} />
                <Route path="/DaftarKasusLawyer" element={<DaftarKasusLawyer />} />
            </Routes>
        </Router>
    );
}

export default App;
