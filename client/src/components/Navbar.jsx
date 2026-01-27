import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <HiOutlineBriefcase />
          </div>
          <span className="navbar-logo-text gradient-text">CareerCraft</span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className="navbar-link">
            <HiOutlineBriefcase />
            <span>Jobs</span>
          </Link>
          <Link to="/resume-builder" className="navbar-link">
            <HiOutlineDocumentText />
            <span>Resume Builder</span>
          </Link>
        </div>

        <div className="navbar-auth">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                <HiOutlineUser />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="navbar-link">
                <HiOutlineLogout />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      <div className={`container navbar-mobile ${isOpen ? 'open' : ''}`}>
        <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="navbar-mobile-theme">
          {theme === 'dark' ? <><HiOutlineSun /> Light Mode</> : <><HiOutlineMoon /> Dark Mode</>}
        </button>
        <Link to="/jobs" onClick={() => setIsOpen(false)}>Jobs</Link>
        <Link to="/resume-builder" onClick={() => setIsOpen(false)}>Resume Builder</Link>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
