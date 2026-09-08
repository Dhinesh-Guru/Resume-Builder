import React from 'react';

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

export default function ResumePreview({ data }) {
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

  // Check if extraAnswers has valid skill entries
  const hasExtraSkills = Object.values(extraAnswers).some(val => val && val.trim().length > 0);
  const validProjects = Array.isArray(projects) ? projects.filter(p => p.title?.trim() || p.description?.trim()) : [];
  const validCerts = Array.isArray(certifications) ? certifications.filter(c => c.name?.trim()) : [];
  const validExperiences = Array.isArray(experiences) ? experiences.filter(e => e.jobTitle?.trim() || e.company?.trim()) : [];

  // Support both array educations and fallback single degree fields
  const validEducations = Array.isArray(educations) && educations.length > 0
    ? educations.filter(e => e.degree?.trim() || e.university?.trim())
    : (degree || university ? [{ degree, fieldOfStudy, university, gradYear }] : []);

  return (
    <div 
      id="ats-resume-preview-document"
      style={{
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '2.5rem',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        minHeight: '800px',
        lineHeight: 1.5,
        fontSize: '10pt',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Header / Contact Info */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: 0 }}>
          {fullName || 'YOUR NAME'}
        </h1>
        <p style={{ fontSize: '11pt', fontWeight: 700, color: '#374151', margin: '0.2rem 0 0.5rem 0' }}>
          {jobTitle}
        </p>
        <div style={{ fontSize: '9pt', color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem 0.75rem' }}>
          {email && <span>{email}</span>}
          {phone && <span>• {phone}</span>}
          {location && <span>• {location}</span>}
          {linkedin && <span>• {linkedin}</span>}
          {github && <span>• {github}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.4rem', color: '#111827' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: 0, textAlign: 'justify', color: '#374151', fontSize: '9.5pt', lineHeight: 1.5 }}>
            {summary}
          </p>
        </div>
      )}

      {/* Technical Skills & Competencies */}
      {(hasExtraSkills || skills || otherSkills) && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#111827' }}>
            TECHNICAL SKILLS
          </h2>
          {hasExtraSkills && (
            Object.entries(extraAnswers).map(([key, val]) => val && val.trim() ? (
              <div key={key} style={{ marginBottom: '0.3rem', fontSize: '9.5pt' }}>
                <strong style={{ color: '#111827', fontWeight: 700 }}>
                  {LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1')}:
                </strong>{' '}
                <span style={{ color: '#374151' }}>{val}</span>
              </div>
            ) : null)
          )}

          {otherSkills && otherSkills.trim() && (
            <div style={{ marginBottom: '0.3rem', fontSize: '9.5pt' }}>
              <strong style={{ color: '#111827', fontWeight: 700 }}>Other Technical & Soft Skills:</strong>{' '}
              <span style={{ color: '#374151' }}>{otherSkills}</span>
            </div>
          )}

          {!hasExtraSkills && skills && (
            <div style={{ fontSize: '9.5pt', color: '#374151' }}>
              <strong style={{ color: '#111827', fontWeight: 700 }}>Core Skills:</strong> {skills}
            </div>
          )}
        </div>
      )}

      {/* Work Experience */}
      {validExperiences.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.6rem', color: '#111827' }}>
            WORK EXPERIENCE
          </h2>
          {validExperiences.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#111827', fontSize: '10pt' }}>
                <div>
                  <strong style={{ fontWeight: 700 }}>{exp.jobTitle || 'Role Title'}</strong>
                  {exp.company && <span style={{ color: '#374151', fontWeight: 600 }}> — {exp.company}</span>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <span style={{ fontSize: '9pt', fontWeight: 600, color: '#4b5563' }}>
                    {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                  </span>
                )}
              </div>
              {exp.responsibilities && (
                <div style={{ marginTop: '0.25rem', color: '#374151', fontSize: '9.5pt' }}>
                  {exp.responsibilities.split('\n').map((bullet, bIdx) => bullet.trim() ? (
                    <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.15rem' }}>
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

      {/* Key Projects */}
      {validProjects.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.6rem', color: '#111827' }}>
            KEY PROJECTS
          </h2>
          {validProjects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#111827', fontSize: '10pt', flexWrap: 'wrap', gap: '0.25rem' }}>
                <strong style={{ fontWeight: 700 }}>{proj.title || `Project #${idx + 1}`}</strong>
                {proj.techStack && (
                  <span style={{ fontSize: '9pt', color: '#4b5563', fontStyle: 'italic', fontWeight: 500 }}>
                    Tech Stack: {proj.techStack}
                  </span>
                )}
              </div>
              {proj.description && (
                <div style={{ marginTop: '0.25rem', color: '#374151', fontSize: '9.5pt' }}>
                  {proj.description.split('\n').map((bullet, bIdx) => bullet.trim() ? (
                    <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.15rem' }}>
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
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#111827' }}>
            CERTIFICATIONS & ACHIEVEMENTS
          </h2>
          {validCerts.map((cert, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#111827', fontSize: '9.5pt', marginBottom: '0.25rem' }}>
              <div>
                <strong style={{ fontWeight: 700 }}>{cert.name}</strong>
                {cert.issuer && <span style={{ color: '#4b5563' }}> — {cert.issuer}</span>}
              </div>
              {cert.year && <span style={{ fontWeight: 600, color: '#4b5563', fontSize: '9pt' }}>{cert.year}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Education Qualifications */}
      {validEducations.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111827', paddingBottom: '0.25rem', marginBottom: '0.4rem', color: '#111827' }}>
            EDUCATION
          </h2>
          {validEducations.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, color: '#111827', fontSize: '10pt' }}>
                <span>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  {edu.score && <span style={{ fontWeight: 600, color: '#374151', fontSize: '9pt' }}> — {edu.score}</span>}
                </span>
                {edu.gradYear && <span style={{ fontSize: '9pt', color: '#4b5563', fontWeight: 600 }}>{edu.gradYear}</span>}
              </div>
              {edu.university && <div style={{ color: '#4b5563', fontSize: '9.5pt', marginTop: '0.05rem' }}>{edu.university}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
