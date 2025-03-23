import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpSignInPage from "./pages/SignUpSignInPage";
import MainPage from "./pages/MainPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignInPage />} />
        <Route path="/home" element={<MainPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
