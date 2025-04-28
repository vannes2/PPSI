import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./PageUser/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./PageUser/AboutUs";
import Login from "./PageUser/Login";
import SignUp from "./PageUser/SignUp";
import HomeAfter from "./PageUser/HomeAfter";
import AboutUsAfter from "./PageUser/AboutUsAfter";
import HeaderAfter from "./components/HeaderAfter";
import ProfileEdit from "./PageUser/ProfileEdit";
import ProfileView from "./PageUser/ProfileView";
import Konsultasi from "./PageUser/konsultasi";
import HomeAdmin from "./PageAdmin/HomeAdmin";
import EditPengacara from "./PageAdmin/EditPengacara";
import ViewPengacara from "./PageAdmin/ViewPengacara";
import TambahPengacara from "./PageAdmin/TambahPengacara";
import TambahArtikel from "./PageAdmin/TambahArtikel";
import Artikel from "./PageUser/Artikel";
import RegisterLawyerPage from "./PageLawyer/RegisterLawyerPage";
import HomeLawyer from "./PageLawyer/HomeLawyer";
import ArtikelLawyer from "./PageLawyer/ArtikelLawyer";
import AboutLawyer from "./PageLawyer/AboutLawyer";
import ProfileLawyer from "./PageLawyer/ProfileLawyer";
import KonsultasiLawyer from "./PageLawyer/KonsultasiLawyer";
import SelectUser from "./PageLawyer/selectUser";
import SidebarAdmin from "./components/SidebarAdmin";
import LawyerRegistrations from "./PageAdmin/LawyerRegistrations";
import ChatPage from "./PageUser/ChatPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="Header" element={<Header />} />
                <Route path="Footer" element={<Footer />} />
                <Route path="AboutUs" element={<AboutUs />} />
                <Route path="Login" element={<Login />} />
                <Route path="SignUp" element={<SignUp />} />
                <Route path="HomeAfter" element={<HomeAfter />}/>
                <Route path="AboutUsAfter" element={<AboutUsAfter />} />
                <Route path="HeaderAfter" element={<HeaderAfter />} />


                {/* <Route path="Header" element={<Header />} />
                <Route path="Footer" element={<Footer />} /> */}
                <Route path="AboutUs" element={<AboutUs />} />
                <Route path="Login" element={<Login />} />
                <Route path="SignUp" element={<SignUp />} />
                <Route path="ProfileEdit" element={<ProfileEdit />} />
                <Route path="ProfileView" element={<ProfileView/>}/>
                <Route path="konsultasi" element={<Konsultasi />} />
                <Route path="HomeAdmin" element={<HomeAdmin />} />
                <Route path="EditPengacara/:id" element={<EditPengacara />}/>
                <Route path="ViewPengacara/:id" element={<ViewPengacara />}/>
                <Route path="TambahPengacara" element={<TambahPengacara />}/>
                <Route path="TambahArtikel" element={<TambahArtikel />}/>
                <Route path="Artikel" element={<Artikel />}/>
                <Route path="RegisterLawyerPage" element={<RegisterLawyerPage />} />
                <Route path="HomeLawyer" element={<HomeLawyer />} />
                <Route path="ArtikelLawyer" element={<ArtikelLawyer />} />
                <Route path="AboutLawyer" element={<AboutLawyer />} />
                <Route path="ProfileLawyer" element={<ProfileLawyer />} />
                <Route path="KonsultasiLawyer" element={<KonsultasiLawyer />} />
                <Route path="SelectUser" element={<SelectUser />} />
                <Route path="SidebarAdmin" element={<SidebarAdmin/>} />
                <Route path="LawyerRegistrations" element={<LawyerRegistrations/>} />
                <Route path="/chat/:contactRole/:contactId" element={<ChatPage />} />

            </Routes>
        </Router>
    );
}

export default App;