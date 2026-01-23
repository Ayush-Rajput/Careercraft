import { useState } from 'react';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineBriefcase } from 'react-icons/hi';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [search, setSearch] = useState(initialValues.search || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [experience, setExperience] = useState(initialValues.experience || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location, experience });
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Job title or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
          />
        </div>

        <div className="relative md:col-span-1">
          <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="City or location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input pl-12"
          />
        </div>

        <div className="relative md:col-span-1">
          <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="input pl-12"
          >
            <option value="">Experience</option>
            <option value="0">Fresher</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>

        <button type="submit" className="btn-primary md:col-span-1">
          <HiOutlineSearch className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
