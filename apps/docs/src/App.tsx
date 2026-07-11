import { useState } from 'react';
import { LensImage } from 'lensjs/react';
import './App.css';

function App() {
  const [effect, setEffect] = useState<'zoom' | 'glare' | 'glass' | 'blur-vignette'>('zoom');
  const [imgUrl, setImgUrl] = useState<string>('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop');

  const effectsList = [
    { id: 'zoom', name: 'Zoom Effect' },
    { id: 'glare', name: 'Glare Sweep' },
    { id: 'glass', name: 'Glass Glow' },
    { id: 'blur-vignette', name: 'Blur Vignette' },
  ] as const;

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <span>👁️</span> lensjs
        </div>
        <div className="nav-links">
          <a href="https://github.com/alikaner/lensjs" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>Stunning <span>Lens Effects</span> for React</h1>
          <p>
            A lightweight, modern utility library to wrap your image elements in premium, interactive hover effects. Works out of the box with React.js & Next.js.
          </p>
        </section>

        <section className="playground-section">
          <div className="preview-container">
            <LensImage 
              src={imgUrl} 
              alt="Demo Lens Image" 
              effect={effect}
              style={{ width: '100%', maxWidth: '360px', height: '360px', borderRadius: '16px' }}
            />
          </div>

          <div className="controls-container">
            <div className="control-group">
              <span className="control-label">Select Effect Preset</span>
              <div className="effect-selector">
                {effectsList.map((eff) => (
                  <button
                    key={eff.id}
                    className={`effect-btn ${effect === eff.id ? 'active' : ''}`}
                    onClick={() => setEffect(eff.id)}
                  >
                    {eff.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">Custom Image URL</span>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Enter image URL..."
              />
            </div>

            <div className="control-group">
              <span className="control-label">React Code Snippet</span>
              <div className="code-preview">
                <pre>
                  <span className="code-keyword">import</span> {'{'} <span className="code-tag">LensImage</span> {'}'} <span className="code-keyword">from</span> <span className="code-str">'lensjs/react'</span>;
                  {'\n\n'}
                  <span className="code-keyword">function</span> <span className="code-tag">MyComponent</span>() {'{\n'}
                  {'  '}<span className="code-keyword">return</span> (
                  {'\n    '}&lt;<span className="code-tag">LensImage</span>
                  {'\n      '}<span className="code-attr">src</span>=<span className="code-str">"{imgUrl.substring(0, 30)}..."</span>
                  {'\n      '}<span className="code-attr">effect</span>=<span className="code-str">"{effect}"</span>
                  {'\n    '}/&gt;{'\n  '});{'\n'}
                  {'}'}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <h2>Getting Started</h2>
          
          <div className="install-box">
            <span className="install-command">npm install lensjs</span>
            <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Production Ready</span>
          </div>

          <div className="docs-grid">
            <div className="doc-card">
              <h3>Next.js (App Router) Support</h3>
              <p>
                `lensjs` has built-in `"use client"` indicators. You can import and use `<LensImage />` directly in your Server components:
              </p>
              <ul>
                <li>Seamless SSR styling</li>
                <li>Hydrates instantly on client hover</li>
                <li>Supports standard HTML Image attributes</li>
              </ul>
            </div>

            <div className="doc-card">
              <h3>Fully Extensible CSS</h3>
              <p>
                Our wrapper adds a `data-lens-effect` attribute and a wrapping class `.lens-image-wrapper`. You can customize the transitions, zoom ratios, and reflections via standard CSS overrides!
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} lensjs. Built for high-performance image experiences.</p>
      </footer>
    </div>
  );
}

export default App;
