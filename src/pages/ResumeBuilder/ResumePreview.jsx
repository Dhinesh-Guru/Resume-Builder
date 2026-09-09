import React, { useRef, useState, useLayoutEffect } from 'react';

const LABEL_MAP = {
  languages: 'Programming Languages',
  frameworks: 'Frameworks & Libraries',
  tools: 'Developer Tools & DBs',
  testingTypes: 'Testing Types',
  testingTools: 'Testing Tools & Frameworks',
  bugTrackers: 'Bug Tracking & Management',
  qualityStandards: 'Quality Standards',
  analysisTools: 'Analytics & BI Tools',
  datasets: 'Data Sources & Modeling',
  software: 'Software Proficiency',
  accountingTypes: 'Accounting Domains',
  methodologies: 'Project Methodologies',
  pmTools: 'Management Tools',
  teamMetrics: 'Team & Scope',
  designTools: 'Design Tools',
  specialization: 'Design Specialties',
  portfolioUrl: 'Portfolio',
  channels: 'Marketing Channels',
  marketingTools: 'Marketing Tools',
  hrTools: 'HRMS & ATS Tools',
  recruitmentVolume: 'Recruitment Scope',
  crmTools: 'CRM & Sales Tools',
  targetsAchieved: 'Performance',
  salesType: 'Sales Domain',
  cloudPlatforms: 'Cloud Platforms',
  devopsTools: 'CI/CD & IaC Tools',
  monitoring: 'Monitoring & Logging',
  osProficiency: 'Operating Systems',
  networking: 'Networking & Security',
  scripting: 'Scripting & Automation',
  specializedSkills: 'Domain Skills',
  coreTools: 'Tools & Technologies'
};

export default function ResumePreview({ data, allowTwoPages = false, onOverflowDetected }) {
  const containerRef = useRef(null);
  const [fontScale, setFontScale] = useState(1.0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const {
    fullName = 'YOUR FULL NAME',
    email = 'email@example.com',
    phone = '+91 98765 43210',
    location = 'City, State',
    linkedin = '',
    github = '',
    jobTitle = 'Target Role Title',
    summary = '',
    skills = '',
    otherSkills = '',
    experiences = [],
    projects = [],
    certifications = [],
    educations = [],
    degree = '',
    fieldOfStudy = '',
    university = '',
    gradYear = '',
    extraAnswers = {}
  } = data || {};

  // Controlled Font Scaling & Overflow Detection
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (allowTwoPages) {
      setFontScale(1.0);
      setIsOverflowing(true);
      if (onOverflowDetected) onOverflowDetected(false);
      return;
    }

    const element = containerRef.current;
    // Standard A4 container height target at 800px width
    const SINGLE_PAGE_MAX_HEIGHT = 1060;
    const currentHeight = element.scrollHeight;

    if (currentHeight > SINGLE_PAGE_MAX_HEIGHT) {
      if (fontScale > 0.95) {
        // Apply gentle minor scaling (0.94) to fit slight overflows comfortably
        setFontScale(0.94);
      } else {
        // Content exceeds single page even with gentle font scale (0.94)
        setIsOverflowing(true);
        if (onOverflowDetected) {
          onOverflowDetected(true);
        }
      }
    } else {
      setIsOverflowing(false);
      // If content fits comfortably at 1.0, maintain standard full-size fonts
      if (currentHeight < 900 && fontScale < 1.0) {
        setFontScale(1.0);
      }
    }
  }, [data, fontScale, allowTwoPages, onOverflowDetected]);

  // Check if extraAnswers has valid skill entries
  const hasExtraSkills = Object.values(extraAnswers).some(val => val && val.trim().length > 0);
  const validProjects = Array.isArray(projects) ? projects.filter(p => p.title?.trim() || p.description?.trim()) : [];
  const validCerts = Array.isArray(certifications) ? certifications.filter(c => c.name?.trim()) : [];
  const validExperiences = Array.isArray(experiences) ? experiences.filter(e => e.jobTitle?.trim() || e.company?.trim()) : [];

  // Support both array educations and fallback single degree fields
  const validEducations = Array.isArray(educations) && educations.length > 0
    ? educations.filter(e => e.degree?.trim() || e.university?.trim())
    : (degree || university ? [{ degree, fieldOfStudy, university, gradYear }] : []);

  // Helper font size scaler
  const fs = (basePt) => `${(basePt * fontScale).toFixed(1)}pt`;
  const spacing = (baseRem) => `${(baseRem * fontScale).toFixed(2)}rem`;

  return (
    <div 
      id="ats-resume-preview-document"
      ref={containerRef}
      style={{
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: spacing(2.5),
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        minHeight: '800px',
        lineHeight: 1.45,
        fontSize: fs(10),
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header / Contact Info */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: spacing(0.75), marginBottom: spacing(1.15) }}>
        <h1 style={{ fontSize: fs(18), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: 0 }}>
          {fullName || 'YOUR NAME'}
        </h1>
        <p style={{ fontSize: fs(11), fontWeight: 700, color: '#374151', margin: '0.2rem 0 0.4rem 0' }}>
          {jobTitle}
        </p>
        <div style={{ fontSize: fs(9), color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4rem 0.75rem' }}>
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
          {linkedin && <span>• {linkedin}</span>}
          {github && <span>• {github}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div style={{ marginBottom: spacing(1.15) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.35rem', color: '#111827' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: 0, textAlign: 'justify', color: '#374151', fontSize: fs(9.5), lineHeight: 1.45 }}>
            {summary}
          </p>
        </div>
      )}

      {/* Technical Skills & Competencies */}
      {(hasExtraSkills || skills || otherSkills) && (
        <div style={{ marginBottom: spacing(1.15) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            TECHNICAL SKILLS
          </h2>
          {hasExtraSkills && (
            Object.entries(extraAnswers).map(([key, val]) => val && val.trim() ? (
              <div key={key} style={{ marginBottom: '0.25rem', fontSize: fs(9.5) }}>
                <strong style={{ color: '#111827', fontWeight: 700 }}>
                  {LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1')}:
                </strong>{' '}
                <span style={{ color: '#374151' }}>{val}</span>
              </div>
            ) : null)
          )}

          {otherSkills && otherSkills.trim() && (
            <div style={{ marginBottom: '0.25rem', fontSize: fs(9.5) }}>
              <strong style={{ color: '#111827', fontWeight: 700 }}>Additional Tools & Software:</strong>{' '}
              <span style={{ color: '#374151' }}>{otherSkills}</span>
            </div>
          )}

          {!hasExtraSkills && skills && (
            <div style={{ fontSize: fs(9.5), color: '#374151' }}>
              <strong style={{ color: '#111827', fontWeight: 700 }}>Core Skills:</strong> {skills}
            </div>
          )}
        </div>
      )}

      {/* Work Experience */}
      {validExperiences.length > 0 && (
        <div style={{ marginBottom: spacing(1.15) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.5rem', color: '#111827' }}>
            WORK EXPERIENCE
          </h2>
          {validExperiences.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: spacing(0.75) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#111827', fontSize: fs(10) }}>
                <div>
                  <strong style={{ fontWeight: 700 }}>{exp.jobTitle || 'Role Title'}</strong>
                  {exp.company && <span style={{ color: '#374151', fontWeight: 600 }}> — {exp.company}</span>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <span style={{ fontSize: fs(9), fontWeight: 600, color: '#4b5563' }}>
                    {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                  </span>
                )}
              </div>
              {exp.responsibilities && (
                <div style={{ marginTop: '0.2rem', color: '#374151', fontSize: fs(9.5) }}>
                  {exp.responsibilities.split('\n').map((bullet, bIdx) => bullet.trim() ? (
                    <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.12rem' }}>
                      <span style={{ color: '#111827' }}>•</span>
                      <span>{bullet.replace(/^•\s*/, '')}</span>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Projects - Fixed Tech Stack placement below title */}
      {validProjects.length > 0 && (
        <div style={{ marginBottom: spacing(1.15) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.5rem', color: '#111827' }}>
            KEY PROJECTS
          </h2>
          {validProjects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: spacing(0.75) }}>
              {/* Line 1: Project Title in Bold */}
              <div style={{ color: '#111827', fontSize: fs(10), fontWeight: 700 }}>
                {proj.title || `Project #${idx + 1}`}
              </div>
              {/* Line 2: Tech Stack directly below Project Title in Italics */}
              {proj.techStack && (
                <div style={{ fontSize: fs(9), color: '#4b5563', fontStyle: 'italic', fontWeight: 500, marginTop: '0.1rem' }}>
                  Tech Stack: {proj.techStack}
                </div>
              )}
              {/* Line 3: Project Description Bullets */}
              {proj.description && (
                <div style={{ marginTop: '0.2rem', color: '#374151', fontSize: fs(9.5) }}>
                  {proj.description.split('\n').map((bullet, bIdx) => bullet.trim() ? (
                    <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.12rem' }}>
                      <span style={{ color: '#111827' }}>•</span>
                      <span>{bullet.replace(/^•\s*/, '')}</span>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements (Optional) */}
      {validCerts.length > 0 && (
        <div style={{ marginBottom: spacing(1.15) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            CERTIFICATIONS & ACHIEVEMENTS
          </h2>
          {validCerts.map((cert, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#111827', fontSize: fs(9.5), marginBottom: '0.2rem' }}>
              <div>
                <strong style={{ fontWeight: 700 }}>{cert.name}</strong>
                {cert.issuer && <span style={{ color: '#4b5563' }}> — {cert.issuer}</span>}
              </div>
              {cert.year && <span style={{ fontWeight: 600, color: '#4b5563', fontSize: fs(9) }}>{cert.year}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Education Qualifications */}
      {validEducations.length > 0 && (
        <div style={{ marginBottom: spacing(1.0) }}>
          <h2 style={{ fontSize: fs(11), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.2rem', marginBottom: '0.35rem', color: '#111827' }}>
            EDUCATION
          </h2>
          {validEducations.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, color: '#111827', fontSize: fs(10) }}>
                <span>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  {edu.score && <span style={{ fontWeight: 600, color: '#374151', fontSize: fs(9) }}> — {edu.score}</span>}
                </span>
                {edu.gradYear && <span style={{ fontSize: fs(9), color: '#4b5563', fontWeight: 600 }}>{edu.gradYear}</span>}
              </div>
              {edu.university && <div style={{ color: '#4b5563', fontSize: fs(9.5), marginTop: '0.05rem' }}>{edu.university}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Visual Page Break Line (Hidden automatically on PDF Export) */}
      {(allowTwoPages || isOverflowing) && (
        <div 
          className="page-break-indicator"
          style={{
            marginTop: '2rem',
            marginBottom: '1rem',
            padding: '0.6rem 0',
            borderTop: '2px dashed #6366f1',
            borderBottom: '2px dashed #6366f1',
            textAlign: 'center',
            fontSize: '9pt',
            fontWeight: 700,
            color: '#4f46e5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(99, 102, 241, 0.08)'
          }}
        >
          📄 --- PAGE 1 ENDS HERE | PAGE 2 STARTS BELOW --- 📄
        </div>
      )}
    </div>
  );
}
