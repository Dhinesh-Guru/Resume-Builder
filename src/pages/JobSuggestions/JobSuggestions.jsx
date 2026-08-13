import React, { useState, useEffect } from 'react';
import { 
  Search, Briefcase, MapPin, DollarSign, ExternalLink, 
  Upload, FileText, Sparkles, RefreshCw, Building, CheckCircle, Navigation
} from 'lucide-react';
import { extractTextFromFile } from '../../utils/fileParsers';
import { fetchMatchingJobs } from '../../utils/jobApi';

export default function JobSuggestions({ builtResume }) {
  const [sourceOption, setSourceOption] = useState('built'); // 'built' or 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [storedResume, setStoredResume] = useState(builtResume || null);

  useEffect(() => {
    // Check localStorage for built resume
    if (!storedResume) {
      const cached = localStorage.getItem('built_resume_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setStoredResume(parsed);
          if (parsed.jobTitle) {
            setJobTitleInput(parsed.jobTitle);
          }
        } catch (e) {}
      }
    } else if (storedResume.jobTitle) {
      setJobTitleInput(storedResume.jobTitle);
    }
  }, [builtResume]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setSourceOption('upload');
    setLoading(true);

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);

      const lower = text.toLowerCase();
      let detectedTitle = 'Software Engineer';
      if (lower.includes('tester') || lower.includes('qa')) detectedTitle = 'QA / Tester';
      else if (lower.includes('data analyst')) detectedTitle = 'Data Analyst';
      else if (lower.includes('accountant')) detectedTitle = 'Accountant';
      else if (lower.includes('project manager')) detectedTitle = 'Project Manager';
      else if (lower.includes('designer') || lower.includes('ui/ux')) detectedTitle = 'UI/UX Designer';

      setJobTitleInput(detectedTitle);
    } catch (err) {
      alert('Failed to read file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchJobs = async () => {
    const searchRole = jobTitleInput || (storedResume && storedResume.jobTitle) || 'Software Engineer';
    setLoading(true);
    setSearched(true);

    try {
      const results = await fetchMatchingJobs(searchRole);
      setJobs(results);
    } catch (err) {
      alert('Error fetching jobs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const tnCount = jobs.filter(j => j.isTamilNadu).length;
  const otherSouthCount = jobs.filter(j => !j.isTamilNadu).length;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Tamil Nadu & South India <span className="gradient-text">Job Matches</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          Top 10 job opportunities matched to your resume (8+ within Tamil Nadu, max 2 from South India neighbors).
        </p>
      </div>

      {/* Resume Selection Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={20} color="var(--accent-primary)" /> Select Resume Source for Job Matching
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Option A: Use Recently Built Resume */}
          <div
            onClick={() => {
              if (storedResume) {
                setSourceOption('built');
                setJobTitleInput(storedResume.jobTitle || '');
              }
            }}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${sourceOption === 'built' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              background: sourceOption === 'built' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-surface)',
              cursor: storedResume ? 'pointer' : 'not-allowed',
              opacity: storedResume ? 1 : 0.6,
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <FileText size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1rem' }}>Option 1: Use Recently Built Resume</h3>
            </div>
            {storedResume ? (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {storedResume.fullName || 'Built Resume'} ({storedResume.jobTitle})
                </p>
                <span className="badge badge-success" style={{ marginTop: '0.4rem' }}>
                  ✓ Loaded from Resume Builder
                </span>
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No built resume found in session. Build one in the Resume Builder tab first!
              </p>
            )}
          </div>

          {/* Option B: Upload New Resume */}
          <label style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${sourceOption === 'upload' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            background: sourceOption === 'upload' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'block'
          }}>
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Upload size={20} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1rem' }}>Option 2: Upload New Resume</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Click to select PDF or DOCX file'}
            </p>
          </label>
        </div>

        {/* Search Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label className="form-label">Search Job Title / Position:</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Software Engineer, QA Tester, Accountant..."
              value={jobTitleInput} 
              onChange={e => setJobTitleInput(e.target.value)} 
            />
          </div>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleSearchJobs} 
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? <><RefreshCw className="spin" size={18} /> Finding Jobs...</> : <><Search size={18} /> Search Tamil Nadu & South India Jobs</>}
          </button>
        </div>
      </div>

      {/* Job Results Grid */}
      {searched && (
        <div>
          {/* Location Filter Ratio Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Navigation size={18} /> Regional Location Distribution
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Strict rule applied: At least 8 jobs in Tamil Nadu, max 2 from South India neighbors.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                📍 Tamil Nadu ({tnCount} Jobs)
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                📍 Other South India ({otherSouthCount} Jobs)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>
              Top 10 Job Matches for: <span className="gradient-text">{jobTitleInput || 'Target Position'}</span>
            </h2>
            <span className="badge badge-primary">10 Suggestions</span>
          </div>

          {jobs.length === 0 && !loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No jobs found for this exact query. Try refining your job title keyword.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: job.isTamilNadu ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  {/* Location Tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={`badge ${job.isTamilNadu ? 'badge-success' : 'badge-primary'}`}>
                      {job.isTamilNadu ? '📍 Tamil Nadu Location' : '📍 South India Neighbor'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      via {job.source}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        background: job.isTamilNadu ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: job.isTamilNadu ? 'var(--accent-success)' : 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Building size={24} />
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', lineHeight: '1.3', marginBottom: '0.2rem' }}>{job.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{job.company}</p>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <MapPin size={15} color="var(--accent-secondary)" /> {job.location}
                    </div>
                    {job.salary && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        <DollarSign size={15} color="var(--accent-success)" /> {job.salary}
                      </div>
                    )}
                  </div>

                  {/* Job Description */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    {job.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary btn-sm"
                  >
                    Apply Now <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
