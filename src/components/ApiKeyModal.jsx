import React, { useState } from 'react';
import { Key, ExternalLink, X, Check, Info } from 'lucide-react';
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
      <div className="glass-card animate-fade-in" style={{ maxWidth: '540px', width: '100%', position: 'relative' }}>
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
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Power intelligent ATS scoring & job parsing</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.9rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          lineHeight: '1.5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.3rem' }}>
            <Info size={16} /> How to get a FREE Gemini API Key:
          </div>
          <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-main)' }}>
            <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600 }}>Google AI Studio <ExternalLink size={12} style={{ display: 'inline' }} /></a></li>
            <li>Sign in with your Google account</li>
            <li>Click <strong>"Get API Key"</strong> & create a free key in 1 click!</li>
            <li>Paste your key below and click Save.</li>
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
            Stored locally in your browser. If left blank, the app will use our built-in smart local analyzer.
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
