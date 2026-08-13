import React from 'react';
import { FileText, Search, CheckSquare, Sun, Moon, Key } from 'lucide-react';
import { getStoredApiKey } from '../utils/geminiApi';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, onOpenKeyModal }) {
  const hasKey = !!getStoredApiKey();

  return (
    <header className="navbar-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.65rem 0',
      width: '100%'
    }}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('builder')}>
          <div className="brand-icon">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="brand-title">
              ATS<span className="gradient-text">ResumePro</span>
            </h2>
            <p className="brand-subtitle">Smart Builder & Matcher</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="navbar-tabs">
          <button
            onClick={() => setActiveTab('builder')}
            className={`nav-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
          >
            <FileText size={15} /> <span>Resume Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`nav-tab-btn ${activeTab === 'tester' ? 'active' : ''}`}
          >
            <CheckSquare size={15} /> <span>ATS Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`nav-tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          >
            <Search size={15} /> <span>Job Suggestions</span>
          </button>
        </nav>

        {/* Controls: Theme & Key */}
        <div className="navbar-controls">
          <button
            onClick={onOpenKeyModal}
            className="btn btn-secondary btn-sm ai-settings-btn"
            title="Configure Gemini AI Key"
          >
            <Key size={15} />
            <span>AI Settings</span>
            {hasKey && <span className="key-active-dot" />}
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
