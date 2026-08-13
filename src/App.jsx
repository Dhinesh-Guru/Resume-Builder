import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ApiKeyModal from './components/ApiKeyModal';
import ResumeBuilder from './pages/ResumeBuilder/ResumeBuilder';
import ATSTester from './pages/ATSTester/ATSTester';
import JobSuggestions from './pages/JobSuggestions/JobSuggestions';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [builtResume, setBuiltResume] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.body.style.colorScheme = theme;
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleResumeCreated = (data) => {
    setBuiltResume(data);
  };

  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Background Orbs */}
      <div className="bg-decorations">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Page Routing */}
      <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '1rem', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {activeTab === 'builder' && (
          <ResumeBuilder onResumeCreated={handleResumeCreated} />
        )}

        {activeTab === 'tester' && (
          <ATSTester />
        )}

        {activeTab === 'suggestions' && (
          <JobSuggestions builtResume={builtResume} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'var(--bg-glass)'
      }}>
        <div className="container">
          <p>© 2026 ATS ResumePro. Built with Vite + React. Standard ATS Single-Column Layout & AI Optimization.</p>
          <p style={{ marginTop: '0.4rem', fontWeight: '500', color: 'var(--text-main)' }}>Made by Dhinesh Guru</p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
      />
    </div>
  );
}
