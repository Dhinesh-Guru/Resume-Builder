import React, { useState } from 'react';
import { 
  Upload, FileText, Trash2, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, BarChart2, ShieldCheck, FileCheck, ArrowRight, Eye, Target
} from 'lucide-react';
import JobTitleSelector from '../../components/JobTitleSelector';
import { extractTextFromFile } from '../../utils/fileParsers';
import { analyzeResumeWithGemini } from '../../utils/geminiApi';

export default function ATSTester() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setUploadedFile(file);
    setLoadingText(true);
    setReport(null);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 50) {
        throw new Error('Extracted resume text is too short or empty. Please ensure file contains readable text.');
      }
      setExtractedText(text);
    } catch (err) {
      setErrorMsg(err.message);
      setUploadedFile(null);
      setExtractedText('');
    } finally {
      setLoadingText(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedText('');
    setReport(null);
    setErrorMsg('');
  };

  const runAnalysis = async () => {
    if (!uploadedFile || !extractedText) {
      setErrorMsg('Please upload a valid resume file.');
      return;
    }
    if (!jobTitle) {
      setErrorMsg('Please select or enter a target job title.');
      return;
    }

    setErrorMsg('');
    setAnalyzing(true);

    try {
      const results = await analyzeResumeWithGemini(extractedText, jobTitle);
      setReport(results);
    } catch (err) {
      setErrorMsg('Analysis failed: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          ATS Resume <span className="gradient-text">Checker & Tester</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          Upload your existing resume (PDF / DOCX / TXT) and test its compatibility against any target position.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: report ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Input Panel: Upload + Job Selector */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} color="var(--accent-primary)" /> Upload Resume & Select Role
          </h2>

          {/* Drag & Drop File Upload Box */}
          {!uploadedFile ? (
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              border: '2px dashed var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.04)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Upload size={26} />
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                Click to Upload Resume
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, or TXT formats (Max 10MB)
              </p>
            </label>
          ) : (
            /* File Preview & Delete Option Card */
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileCheck size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {uploadedFile.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB • {extractedText.length} characters parsed
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="btn btn-danger btn-sm"
                  title="Delete file and re-upload"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              {/* Text Preview Toggle */}
              <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => setShowTextPreview(!showTextPreview)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Eye size={14} /> {showTextPreview ? 'Hide Extracted Text' : 'Preview Extracted Text'}
                </button>
              </div>

              {showTextPreview && (
                <div style={{
                  marginTop: '0.75rem',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  background: 'var(--bg-base)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-muted)'
                }}>
                  {extractedText}
                </div>
              )}
            </div>
          )}

          {loadingText && (
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textAlign: 'center', marginBottom: '1rem' }}>
              Reading resume text...
            </p>
          )}

          {/* Job Title Picker */}
          <JobTitleSelector
            selectedTitle={jobTitle}
            onSelectTitle={(title) => setJobTitle(title)}
            titlePrompt="Select or enter the Target Position for testing:"
          />

          {errorMsg && (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-danger)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {errorMsg}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={runAnalysis}
            disabled={!uploadedFile || !jobTitle || analyzing}
          >
            {analyzing ? (
              <><RefreshCw className="spin" size={18} /> Analyzing Resume for ATS Match...</>
            ) : (
              <><Sparkles size={18} /> Run ATS Test & Compatibility Check</>
            )}
          </button>
        </div>

        {/* Right Output Panel: ATS Report & Breakdown */}
        {report && (
          <div className="glass-card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>ATS Compatibility Report</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Tested Position: <strong style={{ color: 'var(--accent-primary)' }}>{jobTitle}</strong>
                </p>
              </div>
              <span className="badge badge-primary">
                Source: {report.source === 'gemini-ai' ? 'Gemini AI' : 'Smart Heuristics'}
              </span>
            </div>

            {/* Best Role Match Notification Banner */}
            {report.bestMatchingRole && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))',
                border: '1.5px solid var(--accent-success)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--accent-success)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Target size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--accent-success)', marginBottom: '0.2rem' }}>
                    🎯 Role Match Recommendation
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', margin: 0, fontWeight: 600 }}>
                    Your uploaded resume is <span style={{ color: 'var(--accent-success)', textDecoration: 'underline' }}>{report.bestMatchingRole.matchScore}% matched</span> for the <span style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>"{report.bestMatchingRole.title}"</span> position based on your extracted skills and experience!
                  </p>
                </div>
              </div>
            )}

            {/* Score Gauges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: report.overallScore >= 75 ? 'var(--accent-success)' : report.overallScore >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)' }}>
                  {report.overallScore}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall ATS Score</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {report.jobMatchScore}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Job Match</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  {report.formattingScore}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Formatting</div>
              </div>
            </div>

            {/* Summary Text */}
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)', fontSize: '0.9rem' }}>
              {report.summary}
            </div>

            {/* Passed Checks */}
            {report.passedChecks && report.passedChecks.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent-success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} /> Passed ATS Checks
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {report.passedChecks.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--accent-success)' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {report.missingKeywords && report.missingKeywords.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent-warning)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={18} /> Important Missing Keywords for {jobTitle}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {report.missingKeywords.map((kw, i) => (
                    <span key={i} className="badge badge-warning" style={{ textTransform: 'capitalize' }}>
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={18} color="var(--accent-primary)" /> Recommendations to Improve ATS Ranking
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {report.recommendations.map((rec, i) => (
                    <li key={i} style={{
                      padding: '0.75rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.5rem',
                      fontSize: '0.85rem',
                      borderLeft: '3px solid var(--accent-primary)'
                    }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
