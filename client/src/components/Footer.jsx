import { Link } from 'react-router-dom';
import { HiOutlineBriefcase } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon">
                <HiOutlineBriefcase />
              </div>
              <span className="navbar-logo-text gradient-text">CareerCraft</span>
            </Link>
            <p>Your one-stop platform for job searching and resume building. Find your dream job and craft the perfect resume.</p>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">For Job Seekers</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/resume-builder">Resume Builder</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">For Recruiters</h4>
            <Link to="/register">Post a Job</Link>
            <Link to="/dashboard">Manage Listings</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CareerCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
