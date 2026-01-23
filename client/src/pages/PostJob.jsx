import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/api';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', location: '', type: 'Full-time', salary: { min: '', max: '' }, experience: { min: '', max: '' }, description: '', requirements: [''], skills: [''], benefits: [''] });

  const handleChange = (k, v) => setFormData({ ...formData, [k]: v });
  const handleNested = (p, k, v) => setFormData({ ...formData, [p]: { ...formData[p], [k]: v } });
  const handleArray = (f, i, v) => { const u = [...formData[f]]; u[i] = v; setFormData({ ...formData, [f]: u }); };
  const addItem = (f) => setFormData({ ...formData, [f]: [...formData[f], ''] });
  const removeItem = (f, i) => { if (formData[f].length > 1) setFormData({ ...formData, [f]: formData[f].filter((_, idx) => idx !== i) }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await jobService.createJob({ ...formData, salary: { min: formData.salary.min ? parseInt(formData.salary.min) : undefined, max: formData.salary.max ? parseInt(formData.salary.max) : undefined, currency: 'INR' }, experience: { min: formData.experience.min ? parseInt(formData.experience.min) : 0, max: formData.experience.max ? parseInt(formData.experience.max) : undefined }, requirements: formData.requirements.filter(r => r.trim()), skills: formData.skills.filter(s => s.trim()), benefits: formData.benefits.filter(b => b.trim()) });
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Failed to post job'); }
    finally { setLoading(false); }
  };

  if (!user || user.role !== 'recruiter') { navigate('/dashboard'); return null; }

  return (
    <div className="page">
      <div className="container post-job">
        <div className="page-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to create a new job listing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="post-job-section">
            <h2>Basic Information</h2>
            <div className="form-group"><label className="form-label">Job Title *</label><input type="text" value={formData.title} onChange={e => handleChange('title', e.target.value)} className="input" placeholder="e.g. Senior React Developer" required /></div>
            <div className="resume-form-grid">
              <div className="form-group"><label className="form-label">Location *</label><input type="text" value={formData.location} onChange={e => handleChange('location', e.target.value)} className="input" placeholder="e.g. Mumbai, India" required /></div>
              <div className="form-group"><label className="form-label">Job Type *</label><select value={formData.type} onChange={e => handleChange('type', e.target.value)} className="input"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option></select></div>
            </div>
            <div className="resume-form-grid">
              <div className="form-group"><label className="form-label">Salary Range (₹/year)</label><div className="flex gap-1"><input type="number" value={formData.salary.min} onChange={e => handleNested('salary', 'min', e.target.value)} className="input" placeholder="Min" /><input type="number" value={formData.salary.max} onChange={e => handleNested('salary', 'max', e.target.value)} className="input" placeholder="Max" /></div></div>
              <div className="form-group"><label className="form-label">Experience (years)</label><div className="flex gap-1"><input type="number" value={formData.experience.min} onChange={e => handleNested('experience', 'min', e.target.value)} className="input" placeholder="Min" min="0" /><input type="number" value={formData.experience.max} onChange={e => handleNested('experience', 'max', e.target.value)} className="input" placeholder="Max" /></div></div>
            </div>
            <div className="form-group"><label className="form-label">Description *</label><textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} className="input" placeholder="Describe the role..." required /></div>
          </div>

          <div className="post-job-section">
            <div className="post-job-section-header"><h2>Skills Required</h2><button type="button" onClick={() => addItem('skills')} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
            {formData.skills.map((s, i) => (<div key={i} className="post-job-row"><input type="text" value={s} onChange={e => handleArray('skills', i, e.target.value)} className="input" placeholder="e.g. React" />{formData.skills.length > 1 && <button type="button" onClick={() => removeItem('skills', i)} style={{ color: 'var(--error)', padding: '12px' }}><HiOutlineTrash /></button>}</div>))}
          </div>

          <div className="post-job-section">
            <div className="post-job-section-header"><h2>Requirements</h2><button type="button" onClick={() => addItem('requirements')} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
            {formData.requirements.map((r, i) => (<div key={i} className="post-job-row"><input type="text" value={r} onChange={e => handleArray('requirements', i, e.target.value)} className="input" placeholder="e.g. 3+ years experience" />{formData.requirements.length > 1 && <button type="button" onClick={() => removeItem('requirements', i)} style={{ color: 'var(--error)', padding: '12px' }}><HiOutlineTrash /></button>}</div>))}
          </div>

          <div className="post-job-section">
            <div className="post-job-section-header"><h2>Benefits</h2><button type="button" onClick={() => addItem('benefits')} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
            {formData.benefits.map((b, i) => (<div key={i} className="post-job-row"><input type="text" value={b} onChange={e => handleArray('benefits', i, e.target.value)} className="input" placeholder="e.g. Health insurance" />{formData.benefits.length > 1 && <button type="button" onClick={() => removeItem('benefits', i)} style={{ color: 'var(--error)', padding: '12px' }}><HiOutlineTrash /></button>}</div>))}
          </div>

          <div className="post-job-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Posting...' : 'Post Job'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
