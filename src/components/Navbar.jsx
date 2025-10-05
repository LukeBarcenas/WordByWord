import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <h2 className="logo">WordByWord</h2>
      <ul>
        <li><Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
        <li><Link to="/about" className={pathname === "/about" ? "active" : ""}>About</Link></li>
      </ul>
    </nav>
  );
}
