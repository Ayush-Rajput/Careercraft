import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeService } from '../services/api';
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineLightBulb, HiOutlineCode, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck, HiOutlinePlus, HiOutlineTrash, HiOutlineDownload } from 'react-icons/hi';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [formData, setFormData] = useState({
    template: 'modern',
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
    education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' }],
    experience: [{ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
    skills: [{ name: '', level: 'intermediate' }],
    projects: [{ name: '', description: '', link: '', github: '' }]
  });

  const steps = [
    { id: 1, title: 'Personal', icon: HiOutlineUser },
    { id: 2, title: 'Education', icon: HiOutlineAcademicCap },
    { id: 3, title: 'Experience', icon: HiOutlineBriefcase },
    { id: 4, title: 'Skills', icon: HiOutlineLightBulb },
    { id: 5, title: 'Projects', icon: HiOutlineCode }
  ];

  useEffect(() => { if (!user) { navigate('/login'); return; } fetchResume(); }, [user]);

  const fetchResume = async () => {
    try {
      const r = await resumeService.getMyResume();
      if (r) { setResumeId(r._id); setFormData({ ...formData, ...r, personalInfo: r.personalInfo || formData.personalInfo, education: r.education?.length ? r.education : formData.education, experience: r.experience?.length ? r.experience : formData.experience, skills: r.skills?.length ? r.skills : formData.skills, projects: r.projects?.length ? r.projects : formData.projects }); }
    } catch (e) {}
  };

  const updatePersonal = (k, v) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [k]: v } });
  const updateArray = (s, i, k, v) => { const u = [...formData[s]]; u[i] = { ...u[i], [k]: v }; setFormData({ ...formData, [s]: u }); };
  const addItem = (s, t) => setFormData({ ...formData, [s]: [...formData[s], t] });
  const removeItem = (s, i) => { if (formData[s].length > 1) setFormData({ ...formData, [s]: formData[s].filter((_, idx) => idx !== i) }); };

  const save = async () => { setSaving(true); try { const r = await resumeService.saveResume(formData); setResumeId(r._id); } catch (e) {} finally { setSaving(false); } };

  return (
    <div className="page">
      <div className="container resume-builder">
        <div className="page-header">
          <h1>Resume Builder</h1>
          <p>Create a professional resume in minutes</p>
        </div>

        <div className="resume-progress">
          <div className="resume-steps">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`resume-step ${step >= s.id ? (step > s.id ? 'completed' : 'active') : ''}`} onClick={() => setStep(s.id)}>
                  <div className="resume-step-icon">{step > s.id ? <HiOutlineCheck /> : <s.icon />}</div>
                  <span className="resume-step-label">{s.title}</span>
                </div>
                {i < steps.length - 1 && <div className={`resume-step-line ${step > s.id ? 'completed' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="resume-form">
          {step === 1 && (
            <>
              <h2>Personal Information</h2>
              <div className="resume-form-grid mt-3">
                <div className="form-group"><label className="form-label">Full Name *</label><input type="text" value={formData.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} className="input" placeholder="John Doe" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input type="email" value={formData.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} className="input" placeholder="john@example.com" /></div>
                <div className="form-group"><label className="form-label">Phone</label><input type="tel" value={formData.personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} className="input" placeholder="+91 9876543210" /></div>
                <div className="form-group"><label className="form-label">Location</label><input type="text" value={formData.personalInfo.location} onChange={e => updatePersonal('location', e.target.value)} className="input" placeholder="Mumbai, India" /></div>
                <div className="form-group"><label className="form-label">LinkedIn</label><input type="url" value={formData.personalInfo.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} className="input" placeholder="linkedin.com/in/johndoe" /></div>
                <div className="form-group"><label className="form-label">GitHub</label><input type="url" value={formData.personalInfo.github} onChange={e => updatePersonal('github', e.target.value)} className="input" placeholder="github.com/johndoe" /></div>
              </div>
              <div className="form-group mt-2"><label className="form-label">Summary</label><textarea value={formData.personalInfo.summary} onChange={e => updatePersonal('summary', e.target.value)} className="input" placeholder="Brief professional summary..." /></div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex-between mb-3"><h2>Education</h2><button onClick={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' })} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
              {formData.education.map((e, i) => (
                <div key={i} className="resume-item">
                  {formData.education.length > 1 && <button onClick={() => removeItem('education', i)} className="resume-item-delete"><HiOutlineTrash /></button>}
                  <div className="resume-form-grid">
                    <div className="form-group"><input type="text" value={e.institution} onChange={ev => updateArray('education', i, 'institution', ev.target.value)} className="input" placeholder="Institution" /></div>
                    <div className="form-group"><input type="text" value={e.degree} onChange={ev => updateArray('education', i, 'degree', ev.target.value)} className="input" placeholder="Degree" /></div>
                    <div className="form-group"><input type="text" value={e.field} onChange={ev => updateArray('education', i, 'field', ev.target.value)} className="input" placeholder="Field of Study" /></div>
                    <div className="form-group"><input type="text" value={e.grade} onChange={ev => updateArray('education', i, 'grade', ev.target.value)} className="input" placeholder="Grade/CGPA" /></div>
                    <div className="form-group"><input type="month" value={e.startDate} onChange={ev => updateArray('education', i, 'startDate', ev.target.value)} className="input" /></div>
                    <div className="form-group"><input type="month" value={e.endDate} onChange={ev => updateArray('education', i, 'endDate', ev.target.value)} className="input" /></div>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex-between mb-3"><h2>Experience</h2><button onClick={() => addItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
              {formData.experience.map((e, i) => (
                <div key={i} className="resume-item">
                  {formData.experience.length > 1 && <button onClick={() => removeItem('experience', i)} className="resume-item-delete"><HiOutlineTrash /></button>}
                  <div className="resume-form-grid">
                    <div className="form-group"><input type="text" value={e.company} onChange={ev => updateArray('experience', i, 'company', ev.target.value)} className="input" placeholder="Company" /></div>
                    <div className="form-group"><input type="text" value={e.position} onChange={ev => updateArray('experience', i, 'position', ev.target.value)} className="input" placeholder="Position" /></div>
                    <div className="form-group"><input type="text" value={e.location} onChange={ev => updateArray('experience', i, 'location', ev.target.value)} className="input" placeholder="Location" /></div>
                    <div className="form-group flex items-center"><label className="flex items-center gap-1"><input type="checkbox" checked={e.current} onChange={ev => updateArray('experience', i, 'current', ev.target.checked)} style={{ width: '16px', height: '16px' }} /> Currently working</label></div>
                    <div className="form-group"><input type="month" value={e.startDate} onChange={ev => updateArray('experience', i, 'startDate', ev.target.value)} className="input" /></div>
                    {!e.current && <div className="form-group"><input type="month" value={e.endDate} onChange={ev => updateArray('experience', i, 'endDate', ev.target.value)} className="input" /></div>}
                  </div>
                  <div className="form-group mt-2"><textarea value={e.description} onChange={ev => updateArray('experience', i, 'description', ev.target.value)} className="input" placeholder="Description..." /></div>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex-between mb-3"><h2>Skills</h2><button onClick={() => addItem('skills', { name: '', level: 'intermediate' })} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
              <div className="resume-form-grid">
                {formData.skills.map((s, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <input type="text" value={s.name} onChange={e => updateArray('skills', i, 'name', e.target.value)} className="input" placeholder="Skill" style={{ flex: 1 }} />
                    <select value={s.level} onChange={e => updateArray('skills', i, 'level', e.target.value)} className="input" style={{ width: '130px' }}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option></select>
                    {formData.skills.length > 1 && <button onClick={() => removeItem('skills', i)} style={{ color: 'var(--error)', padding: '8px' }}><HiOutlineTrash /></button>}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="flex-between mb-3"><h2>Projects</h2><button onClick={() => addItem('projects', { name: '', description: '', link: '', github: '' })} className="btn btn-secondary"><HiOutlinePlus /> Add</button></div>
              {formData.projects.map((p, i) => (
                <div key={i} className="resume-item">
                  {formData.projects.length > 1 && <button onClick={() => removeItem('projects', i)} className="resume-item-delete"><HiOutlineTrash /></button>}
                  <div className="resume-form-grid">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><input type="text" value={p.name} onChange={e => updateArray('projects', i, 'name', e.target.value)} className="input" placeholder="Project Name" /></div>
                    <div className="form-group"><input type="url" value={p.link} onChange={e => updateArray('projects', i, 'link', e.target.value)} className="input" placeholder="Live Link" /></div>
                    <div className="form-group"><input type="url" value={p.github} onChange={e => updateArray('projects', i, 'github', e.target.value)} className="input" placeholder="GitHub" /></div>
                  </div>
                  <div className="form-group mt-2"><textarea value={p.description} onChange={e => updateArray('projects', i, 'description', e.target.value)} className="input" placeholder="Description..." /></div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="resume-nav">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="btn btn-ghost"><HiOutlineArrowLeft /> Previous</button>
          <div className="resume-nav-actions">
            <button onClick={save} disabled={saving} className="btn btn-secondary">{saving ? 'Saving...' : 'Save'}</button>
            {resumeId && <button onClick={() => resumeService.downloadResume(resumeId)} className="btn btn-secondary"><HiOutlineDownload /> PDF</button>}
          </div>
          {step < 5 ? <button onClick={() => setStep(step + 1)} className="btn btn-primary">Next <HiOutlineArrowRight /></button> : <button onClick={async () => { await save(); navigate('/dashboard'); }} disabled={saving} className="btn btn-primary">Finish</button>}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
