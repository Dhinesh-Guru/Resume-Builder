import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, FileDown, Plus, Trash2, 
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, AlertCircle, UserCheck
} from 'lucide-react';
import JobTitleSelector from '../../components/JobTitleSelector';
import ResumePreview from './ResumePreview';
import { JOB_SPECIFIC_QUESTIONS, DEFAULT_EXTRA_QUESTIONS } from './questions';
import { exportResumeToPdf, exportResumeToTxt } from '../../utils/resumeExport';

export default function ResumeBuilder({ onResumeCreated }) {
  const [step, setStep] = useState(1); // 1: Job Title, 2: Form, 3: Preview & Download
  const [jobTitle, setJobTitle] = useState('');
  const [jobRoleId, setJobRoleId] = useState('dev');

  // Experience Status: 'experienced' or 'fresher'
  const [experienceStatus, setExperienceStatus] = useState('experienced');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    experiences: [
      { jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }
    ],
    degree: "Bachelor's Degree",
    fieldOfStudy: '',
    university: '',
    gradYear: '',
    extraAnswers: {}
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [downloading, setDownloading] = useState(false);

  const handleJobTitleSelect = (title, roleId) => {
    setJobTitle(title);
    setJobRoleId(roleId);
    setStep(2);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleExtraChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      extraAnswers: { ...prev.extraAnswers, [questionId]: value }
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, experiences: updated }));
    if (errors.experiences) {
      setErrors(prev => ({ ...prev, experiences: null }));
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name is required (minimum 2 characters).';
    }

    // 2. Email Validation (Must contain @ and valid domain like .com, .in, etc.)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address containing "@" and ".com" (e.g. user@gmail.com).';
    }

    // 3. Indian Phone Number Validation (+91 followed by 10 digits or 10-digit mobile number)
    const indianPhoneRegex = /^(\+91[\s\-]?)?[6-9]\d{9}$/;
    const rawPhone = formData.phone.trim();
    if (!rawPhone) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!indianPhoneRegex.test(rawPhone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Mobile number must be a valid Indian 10-digit number (e.g. +91 98765 43210 or 9876543210).';
    }

    // 4. City, State / Country
    if (!formData.location.trim()) {
      newErrors.location = 'City, State / Country is required (e.g. Chennai, Tamilnadu).';
    }

    // 5. Core Skills
    if (!formData.skills.trim()) {
      newErrors.skills = 'Core Skills are required to pass ATS evaluation.';
    }

    // 6. Work Experience Validation (Only if Experienced)
    if (experienceStatus === 'experienced') {
      if (!formData.experiences || formData.experiences.length === 0) {
        newErrors.experiences = 'Please add at least one work experience or switch status to "Fresher".';
      } else {
        const firstExp = formData.experiences[0];
        if (!firstExp.jobTitle.trim() || !firstExp.company.trim()) {
          newErrors.experiences = 'Please fill out Job Title and Company Name for Experience #1.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const completeResume = () => {
    if (!validateForm()) {
      // Scroll to top of form to see errors
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    const finalExperiences = experienceStatus === 'fresher' ? [] : formData.experiences;
    const fullData = { ...formData, experiences: finalExperiences, jobTitle, experienceStatus };
    
    localStorage.setItem('built_resume_data', JSON.stringify(fullData));
    if (onResumeCreated) onResumeCreated(fullData);
    setStep(3);
  };

  const handlePdfDownload = async () => {
    setDownloading(true);
    try {
      await exportResumeToPdf('ats-resume-preview-document', `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleTxtDownload = () => {
    const finalExperiences = experienceStatus === 'fresher' ? [] : formData.experiences;
    exportResumeToTxt({ ...formData, experiences: finalExperiences, jobTitle }, `${formData.fullName.replace(/\s+/g, '_')}_Resume.txt`);
  };

  const extraQuestions = JOB_SPECIFIC_QUESTIONS[jobRoleId] || DEFAULT_EXTRA_QUESTIONS;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Progress Indicator Header */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          ATS-Friendly <span className="gradient-text">Resume Builder</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Create an optimized resume engineered to pass ATS filters and stand out to hiring managers.
        </p>

        {/* Step Tabs */}
        <div style={{
          display: 'inline-flex',
          gap: '1rem',
          marginTop: '1.5rem',
          background: 'var(--bg-surface)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
            1. Target Job Title
          </span>
          <span>→</span>
          <span style={{ color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
            2. Enter Details
          </span>
          <span>→</span>
          <span style={{ color: step >= 3 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
            3. Preview & Download
          </span>
        </div>
      </div>

      {/* STEP 1: Select Job Title */}
      {step === 1 && (
        <div className="glass-card">
          <JobTitleSelector 
            selectedTitle={jobTitle}
            onSelectTitle={handleJobTitleSelect}
            titlePrompt="Step 1: Select your target job title for customized questions"
          />
        </div>
      )}

      {/* STEP 2: Fill Details */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Resume Details for: <span className="gradient-text">{jobTitle}</span></h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fill in your info. Required fields are marked with *.</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>
                Change Job Title
              </button>
            </div>

            {/* Validation Error Alert Box */}
            {Object.keys(errors).length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--accent-danger)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                marginBottom: '1.5rem',
                color: 'var(--accent-danger)',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <AlertCircle size={18} /> Please fix the following required fields before proceeding:
                </div>
                <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                  {Object.values(errors).map((err, i) => err ? <li key={i}>{err}</li> : null)}
                </ul>
              </div>
            )}

            {/* Section 1: Contact Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <User size={18} /> Personal & Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={errors.fullName ? { borderColor: 'var(--accent-danger)' } : {}}
                    placeholder="Guru" 
                    value={formData.fullName} 
                    onChange={e => handleInputChange('fullName', e.target.value)} 
                  />
                  {errors.fullName && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{errors.fullName}</span>}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    style={errors.email ? { borderColor: 'var(--accent-danger)' } : {}}
                    placeholder="user@gmail.com" 
                    value={formData.email} 
                    onChange={e => handleInputChange('email', e.target.value)} 
                  />
                  {errors.email && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label className="form-label">Phone Number (Indian Format) *</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    style={errors.phone ? { borderColor: 'var(--accent-danger)' } : {}}
                    placeholder="+91 98765 43210" 
                    value={formData.phone} 
                    onChange={e => handleInputChange('phone', e.target.value)} 
                  />
                  {errors.phone && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>

                {/* City, State / Country */}
                <div className="form-group">
                  <label className="form-label">City, State / Country *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={errors.location ? { borderColor: 'var(--accent-danger)' } : {}}
                    placeholder="Chennai, Tamilnadu" 
                    value={formData.location} 
                    onChange={e => handleInputChange('location', e.target.value)} 
                  />
                  {errors.location && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{errors.location}</span>}
                </div>

                {/* LinkedIn Profile */}
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="linkedin.com/in/username" 
                    value={formData.linkedin} 
                    onChange={e => handleInputChange('linkedin', e.target.value)} 
                  />
                </div>

                {/* GitHub / Portfolio */}
                <div className="form-group">
                  <label className="form-label">GitHub / Portfolio URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="github.com/username" 
                    value={formData.github} 
                    onChange={e => handleInputChange('github', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Summary & Skills */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <Award size={18} /> Professional Summary & Core Skills
              </h3>
              <div className="form-group">
                <label className="form-label">Professional Summary (2–4 sentences)</label>
                <textarea 
                  className="form-textarea" 
                  placeholder={`Enthusiastic ${jobTitle} based in Chennai, Tamilnadu skilled in software development, problem solving, and modern frameworks...`}
                  value={formData.summary} 
                  onChange={e => handleInputChange('summary', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Core Skills (Comma separated) *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={errors.skills ? { borderColor: 'var(--accent-danger)' } : {}}
                  placeholder="e.g. JavaScript, Python, React, SQL, Problem Solving"
                  value={formData.skills} 
                  onChange={e => handleInputChange('skills', e.target.value)} 
                />
                {errors.skills && <span style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>{errors.skills}</span>}
              </div>
            </div>

            {/* Section 3: Job-Specific Tailored Questions */}
            <div style={{ marginBottom: '2rem', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Sparkles size={18} /> Job-Specific Questions for: {jobTitle}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                These tailored inputs help embed relevant keywords to pass ATS filters for this role.
              </p>

              {extraQuestions.map((q) => (
                <div key={q.id} className="form-group">
                  <label className="form-label">
                    {q.label} {q.required && '*'}
                  </label>
                  {q.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      placeholder={q.placeholder}
                      value={formData.extraAnswers[q.id] || ''}
                      onChange={(e) => handleExtraChange(q.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-input"
                      placeholder={q.placeholder}
                      value={formData.extraAnswers[q.id] || ''}
                      onChange={(e) => handleExtraChange(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Section 4: Work Experience with Fresher vs Experienced Dropdown */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <label className="form-label" style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  <UserCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                  Experience Status: Are you a Fresher or Experienced? *
                </label>
                <select 
                  className="form-select"
                  value={experienceStatus}
                  onChange={e => setExperienceStatus(e.target.value)}
                  style={{ fontSize: '0.95rem', fontWeight: 600 }}
                >
                  <option value="experienced">Experienced (I have prior work / job experience)</option>
                  <option value="fresher">Fresher (Entry-Level / Student / No prior work experience)</option>
                </select>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                  {experienceStatus === 'fresher' 
                    ? '✨ Fresher selected: Work Experience section is hidden for clean entry-level ATS layout.' 
                    : '💼 Experienced selected: Add your past roles and achievements below.'}
                </small>
              </div>

              {/* Show Work Experience block ONLY if Experienced */}
              {experienceStatus === 'experienced' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Briefcase size={18} /> Work Experience
                    </h3>
                    <button className="btn btn-secondary btn-sm" onClick={addExperience}>
                      <Plus size={16} /> Add Position
                    </button>
                  </div>

                  {errors.experiences && (
                    <div style={{ color: 'var(--accent-danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      {errors.experiences}
                    </div>
                  )}

                  {formData.experiences.map((exp, idx) => (
                    <div key={idx} style={{
                      padding: '1.25rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      marginBottom: '1rem',
                      position: 'relative'
                    }}>
                      {formData.experiences.length > 1 && (
                        <button
                          onClick={() => removeExperience(idx)}
                          style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-danger)',
                            cursor: 'pointer'
                          }}
                          title="Remove experience"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem' }}>Experience #{idx + 1}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Job Title *</label>
                          <input type="text" className="form-input" placeholder="Software Engineer" value={exp.jobTitle} onChange={e => handleExperienceChange(idx, 'jobTitle', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Company Name *</label>
                          <input type="text" className="form-input" placeholder="Tech Solutions India" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Start Date</label>
                          <input type="text" className="form-input" placeholder="Jan 2023" value={exp.startDate} onChange={e => handleExperienceChange(idx, 'startDate', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">End Date</label>
                          <input type="text" className="form-input" placeholder="Present / Dec 2024" value={exp.endDate} onChange={e => handleExperienceChange(idx, 'endDate', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Key Bullet Accomplishments (Use numbers: e.g. "Increased team efficiency by 25%")</label>
                        <textarea
                          className="form-textarea"
                          placeholder="• Developed web application components using React and Node.js&#10;• Reduced bug resolution time by 30% through automated testing"
                          value={exp.responsibilities}
                          onChange={e => handleExperienceChange(idx, 'responsibilities', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 5: Education with Tamilnadu Placeholders */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <GraduationCap size={18} /> Education
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <select className="form-select" value={formData.degree} onChange={e => handleInputChange('degree', e.target.value)}>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                    <option value="High School Diploma">High School Diploma</option>
                    <option value="Other Certification">Other Certification</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Field of Study</label>
                  <input type="text" className="form-input" placeholder="Computer Science" value={formData.fieldOfStudy} onChange={e => handleInputChange('fieldOfStudy', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">University / Institution</label>
                  <input type="text" className="form-input" placeholder="Anna University" value={formData.university} onChange={e => handleInputChange('university', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input type="text" className="form-input" placeholder="2024" value={formData.gradYear} onChange={e => handleInputChange('gradYear', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back to Job Title
              </button>
              <button className="btn btn-primary" onClick={completeResume}>
                Preview & Export ATS Resume <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Download */}
      {step === 3 && (
        <div>
          {/* Action Bar */}
          <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle color="var(--accent-success)" size={22} /> Resume Ready for Export!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Single-column, ATS-safe format designed for maximum parsing accuracy.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Edit Content
              </button>
              <button className="btn btn-secondary" onClick={handleTxtDownload}>
                <FileDown size={16} /> Download .TXT (ATS Raw)
              </button>
              <button className="btn btn-primary" onClick={handlePdfDownload} disabled={downloading}>
                <FileDown size={16} /> {downloading ? 'Generating PDF...' : 'Download PDF Resume'}
              </button>
            </div>
          </div>

          {/* Document Render Container */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)' }}>
            <ResumePreview data={{ 
              ...formData, 
              experiences: experienceStatus === 'fresher' ? [] : formData.experiences,
              jobTitle 
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
