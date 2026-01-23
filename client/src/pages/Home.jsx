import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineUsers, HiOutlineShieldCheck, HiOutlineArrowRight, HiOutlineSearch, HiOutlineLocationMarker } from 'react-icons/hi';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams();
    if (formData.get('search')) params.set('search', formData.get('search'));
    if (formData.get('location')) params.set('location', formData.get('location'));
    navigate(`/jobs?${params.toString()}`);
  };

  const features = [
    { icon: HiOutlineBriefcase, title: 'Smart Job Search', desc: 'Find jobs matching your skills with advanced filters' },
    { icon: HiOutlineDocumentText, title: 'Resume Builder', desc: 'Create professional ATS-friendly resumes easily' },
    { icon: HiOutlineUsers, title: 'Direct Applications', desc: 'Apply directly and track your application status' },
    { icon: HiOutlineShieldCheck, title: 'Verified Recruiters', desc: 'Connect with verified recruiters from top companies' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Jobs' },
    { value: '5K+', label: 'Companies' },
    { value: '50K+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Your Career Journey Starts Here
            </div>

            <h1>
              Find Your <span className="gradient-text">Dream Job</span><br />
              Build Your <span className="gradient-text">Perfect Resume</span>
            </h1>

            <p className="hero-subtitle">
              CareerCraft combines powerful job search with an intuitive resume builder. Search thousands of opportunities and create standout resumes — all in one place.
            </p>

            <form onSubmit={handleSearch} className="hero-search">
              <div className="hero-search-inner">
                <div className="input-icon">
                  <HiOutlineSearch className="icon" />
                  <input type="text" name="search" className="input" placeholder="Job title, skills, or company..." />
                </div>
                <div className="input-icon">
                  <HiOutlineLocationMarker className="icon" />
                  <input type="text" name="location" className="input" placeholder="City or location..." />
                </div>
                <button type="submit" className="btn btn-primary">
                  <HiOutlineSearch /> Search
                </button>
              </div>
            </form>

            <div className="hero-links">
              <Link to="/jobs">Browse all jobs <HiOutlineArrowRight /></Link>
              <Link to="/resume-builder">Build your resume <HiOutlineArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value gradient-text">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p>From finding opportunities to presenting yourself professionally, we've got you covered.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <f.icon />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Take the Next Step?</h2>
            <p>Join thousands of professionals who've found their dream jobs through CareerCraft.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-white">Get Started Free <HiOutlineArrowRight /></Link>
              <Link to="/jobs" className="btn btn-outline-white">Browse Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
