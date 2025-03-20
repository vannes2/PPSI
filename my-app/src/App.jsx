import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./PageUser/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./PageUser/AboutUs";
import Login from "./PageUser/Login";
import SignUp from "./PageUser/SignUp";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="Header" element={<Header />} />
                <Route path="Footer" element={<Footer />} /> */}
                <Route path="AboutUs" element={<AboutUs />} />
                <Route path="Login" element={<Login />} />
                <Route path="SignUp" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;