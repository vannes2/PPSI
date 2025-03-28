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
            </Routes>
        </Router>
    );
}

export default App;