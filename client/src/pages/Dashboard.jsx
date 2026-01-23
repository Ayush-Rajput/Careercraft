import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService, applicationService, resumeService } from '../services/api';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineBookmark, HiOutlinePlus, HiOutlineEye, HiOutlineTrash, HiOutlinePencil, HiOutlineUsers, HiOutlineDownload } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ applications: [], savedJobs: [], myJobs: [], resume: null });

  useEffect(() => { if (!user) { navigate('/login'); return; } fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user.role === 'jobseeker') {
        const [applications, savedJobs, resume] = await Promise.all([
          applicationService.getMyApplications().catch(() => []),
          applicationService.getSavedJobs().catch(() => []),
          resumeService.getMyResume().catch(() => null)
        ]);
        setData({ applications, savedJobs, myJobs: [], resume });
      } else if (user.role === 'recruiter') {
        const myJobs = await jobService.getMyJobs().catch(() => []);
        setData({ applications: [], savedJobs: [], myJobs, resume: null });
      }
    } catch (error) {} 
    finally { setLoading(false); }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Delete this job posting?')) return;
    try { await jobService.deleteJob(jobId); setData({ ...data, myJobs: data.myJobs.filter(job => job._id !== jobId) }); } catch (error) {}
  };

  const statusBadge = { pending: 'badge-warning', reviewed: 'badge-primary', shortlisted: 'badge-success', rejected: 'badge-error', hired: 'badge-success' };

  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="loader"></div></div>;

  return (
    <div className="page">
      <div className="container dashboard">
        <div className="page-header">
          <h1>Welcome, {user?.name}!</h1>
          <p>{user?.role === 'jobseeker' ? 'Manage your applications and resume' : 'Manage your job postings'}</p>
        </div>

        {/* Job Seeker Dashboard */}
        {user?.role === 'jobseeker' && (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-card-icon primary"><HiOutlineBriefcase /></div>
                <div><div className="stat-card-value">{data.applications.length}</div><div className="stat-card-label">Applications</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon purple"><HiOutlineBookmark /></div>
                <div><div className="stat-card-value">{data.savedJobs.length}</div><div className="stat-card-label">Saved Jobs</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon green"><HiOutlineDocumentText /></div>
                <div><div className="stat-card-value">{data.resume ? '1' : '0'}</div><div className="stat-card-label">Resume</div></div>
              </div>
            </div>

            <div className="tabs">
              {['applications', 'saved', 'resume'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`tab ${activeTab === tab ? 'active' : ''}`}>
                  {tab === 'saved' ? 'Saved Jobs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'applications' && (
              <div className="flex flex-col gap-2">
                {data.applications.length === 0 ? (
                  <div className="jobs-empty"><p>No applications yet</p><Link to="/jobs" className="btn btn-primary">Browse Jobs</Link></div>
                ) : data.applications.map((app) => (
                  <div key={app._id} className="app-card">
                    <div className="app-card-info">
                      <h3>{app.job?.title}</h3>
                      <p>{app.job?.company}</p>
                      <p className="date">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge ${statusBadge[app.status] || 'badge-primary'}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="flex flex-col gap-2">
                {data.savedJobs.length === 0 ? (
                  <div className="jobs-empty"><p>No saved jobs</p><Link to="/jobs" className="btn btn-primary">Browse Jobs</Link></div>
                ) : data.savedJobs.map((job) => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="app-card" style={{ textDecoration: 'none' }}>
                    <div className="app-card-info"><h3>{job.title}</h3><p>{job.company} • {job.location}</p></div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'resume' && (
              <div>
                {data.resume ? (
                  <div className="app-card">
                    <div className="app-card-info">
                      <h3>{data.resume.personalInfo?.fullName}</h3>
                      <p>{data.resume.personalInfo?.email}</p>
                      <p className="date">Updated {new Date(data.resume.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Link to="/resume-builder" className="btn btn-secondary"><HiOutlinePencil /> Edit</Link>
                      <button onClick={() => resumeService.downloadResume(data.resume._id)} className="btn btn-primary"><HiOutlineDownload /> Download</button>
                    </div>
                  </div>
                ) : (
                  <div className="jobs-empty"><p>No resume yet</p><Link to="/resume-builder" className="btn btn-primary">Build Your Resume</Link></div>
                )}
              </div>
            )}
          </>
        )}

        {/* Recruiter Dashboard */}
        {user?.role === 'recruiter' && (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-card-icon primary"><HiOutlineBriefcase /></div>
                <div><div className="stat-card-value">{data.myJobs.length}</div><div className="stat-card-label">Active Jobs</div></div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon green"><HiOutlineUsers /></div>
                <div><div className="stat-card-value">{data.myJobs.reduce((a, j) => a + (j.applicantCount || 0), 0)}</div><div className="stat-card-label">Total Applicants</div></div>
              </div>
            </div>

            <div className="mb-3">
              <Link to="/post-job" className="btn btn-primary"><HiOutlinePlus /> Post New Job</Link>
            </div>

            <div className="flex flex-col gap-2">
              {data.myJobs.length === 0 ? (
                <div className="jobs-empty"><p>No jobs posted yet</p><Link to="/post-job" className="btn btn-primary">Post Your First Job</Link></div>
              ) : data.myJobs.map((job) => (
                <div key={job._id} className="app-card">
                  <div className="app-card-info">
                    <h3>{job.title}</h3>
                    <p>{job.location} • {job.type}</p>
                    <p className="date">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ textAlign: 'center', marginRight: '16px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{job.applicantCount || 0}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applicants</div>
                    </div>
                    <Link to={`/job/${job._id}/applicants`} className="btn btn-ghost"><HiOutlineEye /></Link>
                    <button onClick={() => handleDeleteJob(job._id)} className="btn btn-ghost" style={{ color: 'var(--error)' }}><HiOutlineTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
