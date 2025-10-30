import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Reader from "./pages/Reader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {

  const { user } = useAuthContext()

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login"/>} />
          <Route path="/about" element={user ? <About /> : <Navigate to="/login"/> } />
          <Route path="/reader" element={user ? <Reader /> : <Navigate to="/login"/>} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/"/>} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/"/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
