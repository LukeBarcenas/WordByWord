import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import acronym from '/src/logo.png';

export default function Navbar() {
  const { pathname } = useLocation();
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleLogout = () => {

    logout()

  }

  return (
    <nav className="navbar">
      <img src={acronym} alt="acroynm" style={{ width: '85px', height: '37px' }}/>
      <h2 className="logo" style={{ textAlign: "center"}}>WordByWord</h2>
      <ul>
        {user && (
          <li style={{marginTop: "10px" }}><Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>)}
        {user && (
          <li style={{marginTop: "10px" }}><Link to="/account" className={pathname === "/account" ? "active" : ""}>Account</Link></li>)}
        {!user && (
          <li ><Link to="/login" className={pathname === "/login" ? "active" : ""}>Login</Link></li>)}
        {user && (<li>
          <button onClick={handleLogout} style={{marginTop: "2px" }}> LOG OUT </button>
        </li>)}
      </ul>
    </nav>
  );
}
