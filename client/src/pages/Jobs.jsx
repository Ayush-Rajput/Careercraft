import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ type: searchParams.get('type') || '' });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');

  const { user } = useAuth();
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => { fetchJobs(); if (user?.role === 'jobseeker') fetchSavedJobs(); }, [searchParams, user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { search: searchParams.get('search') || '', location: searchParams.get('location') || '', type: searchParams.get('type') || '', page: searchParams.get('page') || 1 };
      const data = await jobService.getJobs(params);
      setJobs(data.jobs);
      setPagination({ currentPage: data.currentPage, totalPages: data.totalPages, total: data.total });
    } catch (error) { console.error('Failed to fetch jobs:', error); }
    finally { setLoading(false); }
  };

  const fetchSavedJobs = async () => { try { const saved = await applicationService.getSavedJobs(); setSavedJobs(saved.map(job => job._id)); } catch (error) {} };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set('search', searchInput);
    if (locationInput) params.set('location', locationInput);
    if (filters.type) params.set('type', filters.type);
    setSearchParams(params);
  };

  const handleTypeFilter = (type) => { 
    setFilters({ ...filters, type }); 
    const params = new URLSearchParams(searchParams); 
    type ? params.set('type', type) : params.delete('type'); 
    setSearchParams(params); 
  };

  const handleSaveJob = async (jobId) => { 
    if (!user) return; 
    try { 
      await applicationService.toggleSaveJob(jobId); 
      setSavedJobs(savedJobs.includes(jobId) ? savedJobs.filter(id => id !== jobId) : [...savedJobs, jobId]); 
    } catch (error) {} 
  };

  return (
    <div className="page">
      <div className="container jobs-page">
        <div className="page-header">
          <h1>Find Your Perfect Job</h1>
          <p>{pagination.total} jobs available</p>
        </div>

        <form onSubmit={handleSearch} className="jobs-search">
          <div className="jobs-search-inner">
            <div className="input-icon">
              <HiOutlineSearch className="icon" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Job title, skills, or company..." className="input" />
            </div>
            <div className="input-icon">
              <HiOutlineLocationMarker className="icon" />
              <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="City or location..." className="input" />
            </div>
            <button type="submit" className="btn btn-primary">
              <HiOutlineSearch /> Search
            </button>
          </div>
        </form>

        <div className="jobs-layout">
          <aside className="jobs-sidebar">
            <div className="jobs-sidebar-card">
              <h3 className="jobs-sidebar-title"><HiOutlineFilter /> Filters</h3>
              <div className="filter-group">
                <div className="filter-label">Job Type</div>
                {jobTypes.map((type) => (
                  <label key={type} className="filter-option">
                    <input type="radio" name="type" checked={filters.type === type} onChange={() => handleTypeFilter(type)} />
                    <span>{type}</span>
                  </label>
                ))}
                {filters.type && (
                  <button onClick={() => handleTypeFilter('')} style={{ color: 'var(--primary)', fontSize: '0.875rem', marginTop: '8px' }}>Clear filter</button>
                )}
              </div>
            </div>
          </aside>

          <main className="jobs-main">
            {loading ? (
              <div className="flex-center" style={{ padding: '80px 0' }}>
                <div className="loader"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="jobs-empty">
                <p>No jobs found matching your criteria</p>
                <button onClick={() => setSearchParams({})} className="btn btn-secondary">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="jobs-list">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} saved={savedJobs.includes(job._id)} onSave={handleSaveJob} showSaveButton={user?.role === 'jobseeker'} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="jobs-pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => { const params = new URLSearchParams(searchParams); params.set('page', page); setSearchParams(params); }} className={pagination.currentPage === page ? 'active' : ''}>
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
