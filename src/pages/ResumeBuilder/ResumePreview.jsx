import React from 'react';

export default function ResumePreview({ data }) {
  const {
    fullName = 'YOUR FULL NAME',
    email = 'email@example.com',
    phone = '+1 (555) 000-0000',
    location = 'City, State',
    linkedin = '',
    github = '',
    jobTitle = 'Target Role Title',
    summary = '',
    skills = '',
    experiences = [],
    degree = '',
    fieldOfStudy = '',
    university = '',
    gradYear = '',
    extraAnswers = {}
  } = data || {};

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
        fontSize: '10.5pt',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      {/* Header / Contact Info (Single column, centered or left-aligned) */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '20pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: 0 }}>
          {fullName || 'YOUR NAME'}
        </h1>
        <p style={{ fontSize: '11pt', fontWeight: 600, color: '#374151', margin: '0.25rem 0 0.5rem 0' }}>
          {jobTitle}
        </p>
        <div style={{ fontSize: '9.5pt', color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
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
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: 0, textAlign: 'justify', color: '#374151' }}>
            {summary}
          </p>
        </div>
      )}

      {/* Core Skills */}
      {skills && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            CORE SKILLS & COMPETENCIES
          </h2>
          <p style={{ margin: 0, color: '#374151', fontWeight: 500 }}>
            {skills}
          </p>
        </div>
      )}

      {/* Job-Specific Fields */}
      {Object.keys(extraAnswers).length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            TECHNICAL & DOMAIN HIGHLIGHTS
          </h2>
          {Object.entries(extraAnswers).map(([key, val]) => val ? (
            <div key={key} style={{ marginBottom: '0.35rem' }}>
              <strong style={{ textTransform: 'capitalize', color: '#111827' }}>{key.replace(/([A-Z])/g, ' $1')}: </strong>
              <span style={{ color: '#374151' }}>{val}</span>
            </div>
          ) : null)}
        </div>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.5rem', color: '#111827' }}>
            WORK EXPERIENCE
          </h2>
          {experiences.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
                <span>{exp.jobTitle || 'Role Title'} — {exp.company || 'Company Name'}</span>
                <span>{exp.startDate || 'Start'} – {exp.endDate || 'Present'}</span>
              </div>
              {exp.responsibilities && (
                <div style={{ marginTop: '0.25rem', color: '#374151' }}>
                  {exp.responsibilities.split('\n').map((bullet, bIdx) => bullet.trim() ? (
                    <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span>•</span>
                      <span>{bullet.replace(/^•\s*/, '')}</span>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {(degree || university) && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem', color: '#111827' }}>
            EDUCATION
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#111827' }}>
            <span>{degree} {fieldOfStudy ? `in ${fieldOfStudy}` : ''}</span>
            <span>{gradYear}</span>
          </div>
          {university && <div style={{ color: '#4b5563', fontSize: '10pt' }}>{university}</div>}
        </div>
      )}
    </div>
  );
}
