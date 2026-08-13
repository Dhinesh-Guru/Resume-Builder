import React from 'react';
import { FileText, Search, CheckSquare, Sun, Moon, Key } from 'lucide-react';
import { getStoredApiKey } from '../utils/geminiApi';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, onOpenKeyModal }) {
  const hasKey = !!getStoredApiKey();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('builder')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ATS<span className="gradient-text">ResumePro</span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Smart Builder & Matcher</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('builder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: activeTab === 'builder' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'builder' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <FileText size={16} /> Resume Builder
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: activeTab === 'tester' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'tester' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <CheckSquare size={16} /> ATS Tester
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: activeTab === 'suggestions' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'suggestions' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Search size={16} /> Job Suggestions
          </button>
        </nav>

        {/* Controls: Theme & Key */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onOpenKeyModal}
            className="btn btn-secondary btn-sm"
            title="Configure Gemini AI Key"
            style={{ position: 'relative' }}
          >
            <Key size={16} />
            <span style={{ fontSize: '0.8rem' }}>AI Settings</span>
            {hasKey && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-success)'
              }} />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
