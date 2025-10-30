import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleLogout = () => {

    logout()

  }

  return (
    <nav className="navbar">
      <h2 className="logo">WordByWord</h2>
      <ul>
        {user && (
          <li><Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>)}
        {user && (
          <li><Link to="/about" className={pathname === "/about" ? "active" : ""}>About</Link></li>)}
        {!user && (
          <li><Link to="/login" className={pathname === "/login" ? "active" : ""}>Login</Link></li>)}
        {user && (<li>
          <button onClick={handleLogout}> LOG OUT </button>
        </li>)}
      </ul>
    </nav>
  );
}
