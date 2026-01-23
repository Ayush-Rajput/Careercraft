import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineBookmark, HiBookmark } from 'react-icons/hi';

const JobCard = ({ job, saved = false, onSave, showSaveButton = true }) => {
  const formatSalary = (s) => {
    if (!s || (!s.min && !s.max)) return 'Not disclosed';
    if (s.min && s.max) return `₹${(s.min / 100000).toFixed(1)}L - ₹${(s.max / 100000).toFixed(1)}L`;
    return s.min ? `₹${(s.min / 100000).toFixed(1)}L+` : `Up to ₹${(s.max / 100000).toFixed(1)}L`;
  };

  const getExp = (e) => {
    if (!e || (!e.min && !e.max)) return 'Any';
    if (e.min === 0 && e.max === 0) return 'Fresher';
    if (e.min && e.max) return `${e.min}-${e.max} yrs`;
    return e.min ? `${e.min}+ yrs` : `0-${e.max} yrs`;
  };

  const getTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <div className="job-card">
      <div className="job-card-inner">
        <div className="job-card-logo">{job.company?.charAt(0) || 'C'}</div>
        
        <div className="job-card-content">
          <div className="job-card-header">
            <div>
              <Link to={`/jobs/${job._id}`} className="job-card-title">{job.title}</Link>
              <p className="job-card-company">{job.company}</p>
            </div>
            {showSaveButton && onSave && (
              <button onClick={(e) => { e.preventDefault(); onSave(job._id); }} className={`job-card-save ${saved ? 'saved' : ''}`}>
                {saved ? <HiBookmark size={20} /> : <HiOutlineBookmark size={20} />}
              </button>
            )}
          </div>

          <div className="job-card-meta">
            <span><HiOutlineLocationMarker /> {job.location}</span>
            <span><HiOutlineClock /> {getExp(job.experience)}</span>
            <span><HiOutlineCurrencyRupee /> {formatSalary(job.salary)}</span>
          </div>

          {job.skills?.length > 0 && (
            <div className="job-card-skills">
              {job.skills.slice(0, 4).map((skill, i) => (
                <span key={i} className="badge badge-primary">{skill}</span>
              ))}
              {job.skills.length > 4 && <span className="badge">{`+${job.skills.length - 4}`}</span>}
            </div>
          )}

          <div className="job-card-footer">
            <span className="job-card-time">{getTime(job.createdAt)}</span>
            <span className="badge badge-success">{job.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
