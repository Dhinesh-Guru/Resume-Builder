import React, { useState } from 'react';
import { Key, ExternalLink, X, Check, Info, Sparkles, ShieldCheck, Zap } from 'lucide-react';
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '560px', width: '100%', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
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
            color: 'var(--accent-primary)'
          }}>
            <Key size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Google Gemini AI Settings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Power intelligent ATS scoring & recruiter insights</p>
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
            <li><strong>🤖 Recruiter-Level Nuance</strong>: Gemini AI evaluates your resume like a senior human recruiter, understanding contextual achievements, leadership impact, and implicit domain skills beyond simple keyword counts.</li>
            <li><strong>✍️ Tailored Suggestions</strong>: Generates personalized, executive-level improvement tips specifically customized for your exact resume text and target role.</li>
            <li><strong>⚡ Smart Heuristics Fallback (Default)</strong>: 100% offline, free & fast local rule engine. Ideal for offline use or quick instant checks!</li>
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

        <div className="form-group">
          <label className="form-label">Gemini API Key (Optional)</label>
          <input
            type="password"
            className="form-input"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stored locally in your browser. If left blank, the app uses Smart Heuristics automatically.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
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
