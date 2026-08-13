import React, { useState } from 'react';
import { 
  Code, Bug, CheckCircle2, BarChart3, Calculator, Kanban, Palette, 
  Megaphone, Users, TrendingUp, Server, HardDrive, Search, AlertCircle, Sparkles
} from 'lucide-react';
import { CURATED_JOB_TITLES, validateJobTitle } from '../data/jobTitles';

const ICON_MAP = {
  Code, Bug, CheckCircle2, BarChart3, Calculator, Kanban, Palette,
  Megaphone, Users, TrendingUp, Server, HardDrive
};

export default function JobTitleSelector({ selectedTitle, onSelectTitle, titlePrompt = 'Select your target job title:' }) {
  const [customTitle, setCustomTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleCuratedClick = (item) => {
    setValidationError('');
    setCustomTitle('');
    onSelectTitle(item.title, item.id);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      setValidationError('Please enter a custom job title before applying.');
      return;
    }

    const result = validateJobTitle(customTitle);
    
    if (!result.valid) {
      setValidationError(result.message);
      return;
    }

    setValidationError('');
    onSelectTitle(result.sanitized, 'custom');
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={18} color="var(--accent-primary)" />
        {titlePrompt}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Choose from popular role categories or type a custom job title below.
      </p>

      {/* Grid of Curated Job Titles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {CURATED_JOB_TITLES.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || Code;
          const isSelected = selectedTitle === item.title;

          return (
            <div
              key={item.id}
              onClick={() => handleCuratedClick(item)}
              style={{
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
              className="job-card-hover"
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                color: isSelected ? '#ffffff' : 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free-Text Input Section with Validation */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Don't see your exact title? Enter Custom Job Title:</h4>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              style={validationError ? { borderColor: 'var(--accent-danger)' } : {}}
              placeholder="e.g. Cybersecurity Specialist, Robotics Engineer..."
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
                if (validationError) setValidationError('');
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            <Search size={16} /> Apply Custom Title
          </button>
        </form>

        {validationError && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            color: 'var(--accent-danger)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {selectedTitle && !validationError && (
        <div style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-success)',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Selected Role: <span style={{ color: 'var(--text-heading)', textDecoration: 'underline' }}>{selectedTitle}</span>
        </div>
      )}
    </div>
  );
}
