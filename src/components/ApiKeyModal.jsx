import React, { useState } from 'react';
import { Key, ExternalLink, X, Check, Info, Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../utils/geminiApi';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keyInput, setKeyInput] = useState(getStoredApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleRemove = () => {
    setKeyInput('');
    setStoredApiKey('');
    onClose();
  };

  return (
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          maxWidth: '560px', 
          width: '100%', 
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'sticky',
            float: 'right',
            top: '0rem',
            right: '0rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            flexShrink: 0
          }}>
            <Key size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Google Gemini AI Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Power intelligent ATS scoring & recruiter insights</p>
          </div>
        </div>

        {/* Benefits & Comparison Note Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.08))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.9rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.83rem',
          lineHeight: '1.5'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-success)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <Sparkles size={16} /> Why use Gemini AI as your ATS Source?
          </div>
          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
            <li><strong>🤖 Recruiter-Level Nuance</strong>: Gemini AI evaluates your resume like a senior human recruiter, understanding contextual achievements and leadership impact.</li>
            <li><strong>✍️ Tailored Suggestions</strong>: Generates personalized, executive-level improvement tips specifically customized for your exact resume text.</li>
            <li><strong>⚡ Smart Heuristics Fallback</strong>: 100% offline, free & fast local rule engine.</li>
            <li style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed rgba(16, 185, 129, 0.25)', color: 'var(--text-muted)' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              <strong>Processing Speed Note</strong>: Gemini AI communicates securely with Google Cloud servers (~2–4 seconds). Local Smart Heuristics runs instantly (under 50ms).
            </li>
          </ul>
        </div>

        {/* How to Get Key Instructions */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.18)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.83rem',
          lineHeight: '1.5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.3rem' }}>
            <Info size={16} /> How to get a FREE Gemini API Key (100% Free):
          </div>
          <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
            <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--accent-primary)' }}>Google AI Studio <ExternalLink size={12} style={{ display: 'inline' }} /></a></li>
            <li>Sign in with your Google account & click <strong>"Get API Key"</strong></li>
            <li>Copy & paste your key below, then click Save.</li>
          </ol>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Gemini API Key (Optional)</label>
          <input
            type="password"
            className="form-input"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
            Stored locally in your browser. If left blank, the app uses Smart Heuristics automatically.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {getStoredApiKey() && (
            <button className="btn btn-danger btn-sm" onClick={handleRemove}>
              Remove Key
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            {saved ? <><Check size={16} /> Saved!</> : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
}
