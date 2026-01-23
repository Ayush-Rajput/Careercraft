import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService, resumeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineOfficeBuilding, HiOutlineCheckCircle, HiOutlineArrowLeft } from 'react-icons/hi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resume, setResume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => { fetchJob(); if (user) { checkIfApplied(); fetchResume(); } }, [id, user]);

  const fetchJob = async () => { try { setJob(await jobService.getJob(id)); } catch (e) {} finally { setLoading(false); } };
  const checkIfApplied = async () => { try { const apps = await applicationService.getMyApplications(); setApplied(apps.some(a => a.job?._id === id)); } catch (e) {} };
  const fetchResume = async () => { try { setResume(await resumeService.getMyResume()); } catch (e) {} };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try { await applicationService.applyToJob(id, { resumeId: resume?._id, coverLetter }); setApplied(true); setShowModal(false); } catch (e) {}
    finally { setApplying(false); }
  };

  const formatSalary = (s) => { if (!s || (!s.min && !s.max)) return 'Not disclosed'; if (s.min && s.max) return `₹${(s.min/100000).toFixed(1)}L - ₹${(s.max/100000).toFixed(1)}L/year`; return s.min ? `₹${(s.min/100000).toFixed(1)}L+/year` : `Up to ₹${(s.max/100000).toFixed(1)}L/year`; };
  const getExp = (e) => { if (!e || (!e.min && !e.max)) return 'Any experience'; if (e.min === 0 && e.max === 0) return 'Fresher'; if (e.min && e.max) return `${e.min}-${e.max} years`; return e.min ? `${e.min}+ years` : `0-${e.max} years`; };

  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="loader"></div></div>;
  if (!job) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="text-center"><h2>Job Not Found</h2><button onClick={() => navigate('/jobs')} className="btn btn-primary mt-2">Browse Jobs</button></div></div>;

  return (
    <div className="page">
      <div className="container job-details">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted mb-3" style={{ background: 'none', border: 'none' }}>
          <HiOutlineArrowLeft /> Back to jobs
        </button>

        <div className="job-details-header">
          <div className="job-details-header-inner">
            <div className="job-details-logo">{job.company?.charAt(0)}</div>
            <div className="job-details-info">
              <h1>{job.title}</h1>
              <p className="job-details-company">{job.company}</p>
              <div className="job-details-meta">
                <span><HiOutlineLocationMarker /> {job.location}</span>
                <span><HiOutlineClock /> {getExp(job.experience)}</span>
                <span><HiOutlineCurrencyRupee /> {formatSalary(job.salary)}</span>
                <span><HiOutlineOfficeBuilding /> {job.type}</span>
              </div>
            </div>
          </div>
          <div className="job-details-actions">
            {user?.role === 'jobseeker' && (
              applied ? <div className="job-details-applied"><HiOutlineCheckCircle /> Applied</div>
              : <button onClick={() => setShowModal(true)} className="btn btn-primary">Apply Now</button>
            )}
            {!user && <button onClick={() => navigate('/login')} className="btn btn-primary">Login to Apply</button>}
          </div>
        </div>

        <div className="job-details-layout">
          <div>
            <div className="job-details-section">
              <h2>Description</h2>
              <p>{job.description}</p>
            </div>
            {job.requirements?.length > 0 && (
              <div className="job-details-section">
                <h2>Requirements</h2>
                <ul className="job-details-list">{job.requirements.map((r, i) => <li key={i}><HiOutlineCheckCircle style={{ color: 'var(--primary)' }} />{r}</li>)}</ul>
              </div>
            )}
            {job.benefits?.length > 0 && (
              <div className="job-details-section">
                <h2>Benefits</h2>
                <ul className="job-details-list">{job.benefits.map((b, i) => <li key={i}><HiOutlineCheckCircle style={{ color: 'var(--success)' }} />{b}</li>)}</ul>
              </div>
            )}
          </div>
          <div className="job-details-sidebar">
            <div className="job-details-section">
              <h3 style={{ marginBottom: '16px' }}>Skills Required</h3>
              <div className="flex" style={{ flexWrap: 'wrap', gap: '8px' }}>{job.skills?.map((s, i) => <span key={i} className="badge badge-primary">{s}</span>)}</div>
            </div>
            <div className="job-details-section">
              <h3 style={{ marginBottom: '16px' }}>Job Info</h3>
              <div className="job-info-row"><span>Posted</span><span>{new Date(job.createdAt).toLocaleDateString()}</span></div>
              {job.deadline && <div className="job-info-row"><span>Deadline</span><span>{new Date(job.deadline).toLocaleDateString()}</span></div>}
              <div className="job-info-row"><span>Type</span><span>{job.type}</span></div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Apply for {job.title}</h2>
            {!resume && <div className="alert alert-warning">No resume found. Build one for better chances!</div>}
            <div className="form-group">
              <label className="form-label">Cover Letter (Optional)</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="input" placeholder="Brief cover letter..." style={{ minHeight: '120px' }} />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn btn-primary">{applying ? 'Applying...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
