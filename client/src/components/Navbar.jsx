import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { logout as logoutAPI } from '../services/authService.js';
import toast from 'react-hot-toast';
import '../styles/navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout API failed:", err.message);
    } finally {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="nav-logo-icon">
          <span>T</span>
        </div>
        <span>Smart Code Translator</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Editor
        </Link>
        <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
          History
        </Link>
      </div>

      <div className="nav-user-actions">
        <div className="nav-user-info">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="nav-profile-pic" referrerPolicy="no-referrer" />
          ) : (
            <div className="nav-profile-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="nav-username">{user.name}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
