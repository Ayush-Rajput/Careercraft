import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineOfficeBuilding, HiOutlineEye, HiOutlineEyeOff, HiOutlineBriefcase } from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'jobseeker', company: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (formData.role === 'recruiter' && !formData.company) return setError('Company name is required');

    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role, ...(formData.role === 'recruiter' && { company: formData.company }) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <HiOutlineBriefcase />
          </div>
          <h1>Create Account</h1>
          <p className="text-muted">Join CareerCraft today</p>
        </div>

        <div className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="role-selector">
            <button type="button" onClick={() => setFormData({ ...formData, role: 'jobseeker' })} className={`role-btn ${formData.role === 'jobseeker' ? 'active' : ''}`}>
              <HiOutlineUser className="icon" />
              <span>Job Seeker</span>
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, role: 'recruiter' })} className={`role-btn ${formData.role === 'recruiter' ? 'active' : ''}`}>
              <HiOutlineOfficeBuilding className="icon" />
              <span>Recruiter</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon">
                <HiOutlineUser className="icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Enter your name" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon">
                <HiOutlineMail className="icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="Enter your email" required />
              </div>
            </div>

            {formData.role === 'recruiter' && (
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <div className="input-icon">
                  <HiOutlineOfficeBuilding className="icon" />
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="input" placeholder="Enter company name" required />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon">
                <HiOutlineLockClosed className="icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="input" placeholder="Create password" required style={{ paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon">
                <HiOutlineLockClosed className="icon" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input" placeholder="Confirm password" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {loading ? <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
