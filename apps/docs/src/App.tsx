import { useState } from 'react';
import { LensImage, type LensEffect, type LensFilter } from 'lensjs/react';
import 'lensjs/styles.css';
import './App.css';

type Tab = 'landing' | 'docs' | 'examples' | 'sandbox';

// Emojiless inline SVGs for the documentation site
const LensLogoSVG = ({ size = 26 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" className="logo-svg" style={{ marginRight: '8px' }}>
    <circle cx="12" cy="12" r="9" stroke="url(#logo-grad)" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="5" stroke="url(#logo-grad-2)" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" fill="#c084fc" />
    <path d="M12 3a9 9 0 0 1 6.36 2.64" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M12 21a9 9 0 0 1-6.36-2.64" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="logo-grad-2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
  </svg>
);

const LightningSVG = () => (
  <svg className="spec-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const AtomSVG = () => (
  <svg className="spec-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(30 12 12)" />
    <ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(90 12 12)" />
    <ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(150 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const PaintSVG = () => (
  <svg className="spec-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const ChevronSVG = ({ isOpen }: { isOpen: boolean }) => (
  <svg className={`chevron-icon ${isOpen ? 'open' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('landing');
  const [sandboxEffect, setSandboxEffect] = useState<LensEffect>('zoom');
  const [sandboxFilter, setSandboxFilter] = useState<LensFilter | 'none'>('none');
  const [sandboxImg, setSandboxImg] = useState<string>('/lotr.jpg');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [sandboxIntensity, setSandboxIntensity] = useState<number>(1);
  const [sandboxLensSize, setSandboxLensSize] = useState<number>(130);
  const [sandboxLensShape, setSandboxLensShape] = useState<'circle' | 'square'>('circle');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States for landing page hero visual showcase
  const [heroEffect, setHeroEffect] = useState<LensEffect>('invert');
  const [heroFilter, setHeroFilter] = useState<LensFilter | 'none'>('cyberpunk');

  // Accordion open/collapse states for Sandbox
  const [expandedGroups, setExpandedGroups] = useState({
    effects: true,
    aesthetics: false,
    code: true
  });

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isLensEffect = sandboxEffect === 'invert' || sandboxEffect === 'reveal';

  const sandboxCodeSrc = sandboxImg.startsWith('/') ? '/your-image.jpg' : sandboxImg;
  const sandboxRevealSrc = sandboxImg === '/ikiru.jpg' ? '/lotr.jpg' : '/ikiru.jpg';

  const effectsList = [
    { id: 'zoom', name: 'Zoom', desc: 'Scales the image smoothly on hover' },
    { id: 'glare', name: 'Glare Sweep', desc: 'Runs an elegant reflection light across the image' },
    { id: 'glass', name: 'Glass Glow', desc: 'Adds a glassmorphism frosted frame with soft hover glow' },
    { id: 'blur-vignette', name: 'Blur Vignette', desc: 'Focuses center while applying blur and dark vignette' },
    { id: 'invert', name: 'Invert Lens', desc: 'Circular lens follows your cursor, inverting every color beneath it' },
    { id: 'invert-full', name: 'Invert Full', desc: 'Flips the entire image to its exact negative on hover' },
    { id: 'neon', name: 'Neon Glow', desc: 'Applies a vibrant, shifting neon border and shadow' },
    { id: 'reveal', name: 'Reveal Lens', desc: 'Cursor lens that reveals a second image underneath' },
    { id: 'vortex', name: 'Vortex', desc: 'Whirlpool that twists pixels around the center (canvas)' },
    { id: 'noise', name: 'Film Grain', desc: 'Animated analog grain rendered per-pixel (canvas)' },
    { id: 'glitch', name: 'Glitch', desc: 'RGB splits and displaced slices, like corrupted VHS (canvas)' },
    { id: 'fisheye', name: 'Fish Eye', desc: 'Wide-angle barrel bulge magnifying the center (canvas)' },
    { id: 'pixelate', name: 'Pixelate', desc: 'Mosaic blocks that grow as you hover (canvas)' },
    { id: 'denoise', name: 'De-Noise', desc: 'Gaussian smoothing that softens grain and artifacts (canvas)' },
    { id: 'resolution-boost', name: 'Resolution Boost', desc: 'Unsharp-mask sharpening for crisper detail (canvas)' },
    { id: 'wave', name: 'Wave Distortion', desc: 'Fluid rolling wave distortion (canvas)' },
    { id: 'chromatic-aberration', name: 'RGB Split', desc: 'Slightly displaces Red, Green & Blue color channels (canvas)' },
    { id: 'halftone', name: 'Halftone Dots', desc: 'Retro dot-matrix newsprint screen shading (canvas)' },
    { id: 'posterize', name: 'Posterize', desc: 'Reduces image colors into solid blocky bins (canvas)' },
    { id: 'melt', name: 'Melting Shift', desc: 'Drips and melts image pixels vertically (canvas)' },
    { id: 'shadow', name: 'Shadow', desc: 'Soft drop shadow with a gentle floating lift' },
    { id: 'heart-beat', name: 'Heart Beat', desc: 'Rhythmic double-pulse scale, like a heartbeat' },
  ] as const;

  const filtersList: { id: LensFilter | 'none'; name: string }[] = [
    { id: 'none', name: 'None' },
    { id: 'bladerunner', name: 'Blade Runner (Teal & Orange)' },
    { id: 'cyberpunk', name: 'Cyberpunk (Pink & Cyan)' },
    { id: 'vintage', name: 'Vintage (Warm Polaroid)' },
    { id: 'sunset', name: 'Sunset (Golden Red)' },
    { id: 'oceanic', name: 'Oceanic (Cold Teal)' },
    { id: 'duotone-purple', name: 'Duotone Purple' },
    { id: 'duotone-red', name: 'Duotone Red' },
    { id: 'duotone-cyan', name: 'Duotone Cyan' },
    { id: 'dreamy', name: 'Dreamy (Soft Focus)' },
    { id: 'vintage-high', name: 'Vintage Film (High Contrast)' },
    { id: 'amaro', name: 'Amaro (Retro Faded)' },
    { id: 'twilight-1', name: 'Twilight (Cold Blue)' },
    { id: 'twilight-2', name: 'New Moon (Warm Golden)' },
    { id: 'twilight-3', name: 'Eclipse (Muted Shadows)' },
    { id: 'matrix', name: 'The Matrix (Phosphor Green)' },
    { id: 'noir', name: 'Sin City (High Contrast Mono)' },
    { id: 'mad-max', name: 'Mad Max (Scorched Orange)' },
    { id: 'grayscale', name: 'Black & White' },
  ];

  const imagePresets = [
    { name: 'Lord of the Rings', url: '/lotr.jpg' },
    { name: 'Ikiru', url: '/ikiru.jpg' },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const CopyIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="icon check-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  return (
    <div className="app-container">
      {/* Background glow meshes */}
      <div className="glow-mesh glow-mesh-1"></div>
      <div className="glow-mesh glow-mesh-2"></div>

      <header className="header">
        <div className="logo" onClick={() => setActiveTab('landing')}>
          <LensLogoSVG />
          <span className="logo-text">lens<span className="highlight">js</span></span>
        </div>
        <nav className="nav">
          <button className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}>Features</button>
          <button className={`nav-link ${activeTab === 'sandbox' ? 'active' : ''}`} onClick={() => setActiveTab('sandbox')}>Sandbox</button>
          <button className={`nav-link ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>Docs</button>
          <button className={`nav-link ${activeTab === 'examples' ? 'active' : ''}`} onClick={() => setActiveTab('examples')}>Examples</button>
        </nav>
        <div className="header-actions">
          <a href="https://github.com/alikaner/lensjs" target="_blank" rel="noopener noreferrer" className="github-btn">
            <svg className="icon github-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'landing' && (
          <div className="view-fade">
            {/* Hero Section */}
            <section className="hero-layout">
              <div className="hero-text-side">
                <div className="version-tag">v1.0.0 is now live</div>
                <h1>Stunning <span className="gradient-text">Interactive Lens Effects</span> for React</h1>
                <p className="hero-subtitle">
                  A lightweight, zero-dependency utility package to wrap your images in premium, glassmorphic reflections, interactive neon bounds, and silky-smooth hover scaling.
                </p>
                
                <div className="hero-actions-container">
                  <button className="cta-btn primary-cta" onClick={() => setActiveTab('sandbox')}>
                    Open Sandbox
                    <ArrowRightIcon />
                  </button>
                  <button className="cta-btn secondary-cta" onClick={() => setActiveTab('docs')}>
                    Read Documentation
                  </button>
                </div>

                {/* Instant install pill */}
                <div className="install-pill">
                  <span className="install-prompt">$</span>
                  <code className="install-code">npm install lensjs</code>
                  <button 
                    className="copy-pill-btn" 
                    onClick={() => handleCopy('npm install lensjs', 'npm-install')}
                    title="Copy installation command"
                  >
                    {copiedId === 'npm-install' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              <div className="hero-visual-side">
                <div className="hero-showcase-card">
                  <div className="showcase-window-header">
                    <div className="window-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                    <span className="window-title">interactive_lens.tsx</span>
                  </div>
                  
                  <div className="showcase-preview-area">
                    <LensImage
                      src="/lotr.jpg"
                      revealSrc="/ikiru.jpg"
                      effect={heroEffect}
                      filter={heroFilter === 'none' ? undefined : heroFilter}
                      lensShape={heroEffect === 'invert' ? 'square' : 'circle'}
                      lensSize={140}
                      className="hero-showcase-img"
                    />
                  </div>
                  
                  <div className="showcase-footer-controls">
                    <span className="showcase-ctrl-label">Preset:</span>
                    <div className="showcase-presets-row">
                      <button
                        className={`showcase-chip ${heroEffect === 'vortex' ? 'active' : ''}`}
                        onClick={() => { setHeroEffect('vortex'); setHeroFilter('bladerunner'); }}
                      >
                        Vortex
                      </button>
                      <button
                        className={`showcase-chip ${heroEffect === 'invert' ? 'active' : ''}`}
                        onClick={() => { setHeroEffect('invert'); setHeroFilter('cyberpunk'); }}
                      >
                        Invert
                      </button>
                      <button
                        className={`showcase-chip ${heroEffect === 'reveal' ? 'active' : ''}`}
                        onClick={() => { setHeroEffect('reveal'); setHeroFilter('none'); }}
                      >
                        Reveal
                      </button>
                      <button
                        className={`showcase-chip ${heroEffect === 'glitch' ? 'active' : ''}`}
                        onClick={() => { setHeroEffect('glitch'); setHeroFilter('matrix'); }}
                      >
                        Glitch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Demo Feature Grid */}
            <section className="features-grid-section">
              <h2 className="section-title">Built for Modern Aesthetics</h2>
              <div className="features-grid">
                
                <div className="feature-card">
                  <div className="feature-preview">
                    <LensImage src="/lotr.jpg" alt="Glare effect example" effect="glare" className="feat-img" />
                  </div>
                  <h3>Reflection Glare</h3>
                  <p>Runs a silky, dynamic light sweep reflection across the image surface upon mouse hover.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-preview">
                    <LensImage src="/ikiru.jpg" alt="Glass effect example" effect="glass" className="feat-img" />
                  </div>
                  <h3>Frosted Glass</h3>
                  <p>Surrounds the image inside a glassmorphic border with custom hover lighting and card lift.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-preview">
                    <LensImage src="/lotr.jpg" alt="Neon glow example" effect="neon" className="feat-img" />
                  </div>
                  <h3>Neon Spotlight</h3>
                  <p>Vibrant shifting neon outer borders and drop shadows that dynamically scale with the component.</p>
                </div>

              </div>
            </section>

            {/* Core Values Section */}
            <section className="core-specs">
              <div className="spec-card">
                <div className="spec-icon"><LightningSVG /></div>
                <h4>Zero-Dependency</h4>
                <p>Pure CSS-driven transitions and React bindings. No heavy external library bloat.</p>
              </div>
              <div className="spec-card">
                <div className="spec-icon"><AtomSVG /></div>
                <h4>Next.js Support</h4>
                <p>Equipped with client-side hydration triggers. Compatible with App Router and SSR.</p>
              </div>
              <div className="spec-card">
                <div className="spec-icon"><PaintSVG /></div>
                <h4>Extensible Style</h4>
                <p>Configured using class hooks and CSS variables, giving you complete styling freedom.</p>
              </div>
            </section>
          </div>
        )}

        {/* Sandbox/Playground View */}
        {activeTab === 'sandbox' && (
          <div className="view-fade sandbox-container">
            <div className="sandbox-header">
              <h2>Interactive Sandbox</h2>
              <p>Customize presets, select effects, and generate code snippets in real-time.</p>
            </div>

            <div className="sandbox-workspace">
              {/* Left Column: Live Interactive Preview */}
              <div className="sandbox-preview-pane">
                <div className="preview-label">Live Preview (Hover to interact)</div>
                <div className="preview-box">
                  <LensImage
                    src={sandboxImg}
                    alt="Sandbox Preview"
                    effect={sandboxEffect}
                    filter={sandboxFilter === 'none' ? undefined : sandboxFilter}
                    revealSrc={sandboxEffect === 'reveal' ? sandboxRevealSrc : undefined}
                    intensity={sandboxIntensity}
                    lensSize={isLensEffect ? sandboxLensSize : undefined}
                    lensShape={isLensEffect ? sandboxLensShape : undefined}
                    className="sandbox-lens-image"
                  />
                </div>
              </div>

              {/* Right Column: Customizer Controls (Accordion-based) */}
              <div className="sandbox-controls-pane-compact">
                
                {/* Accordion Group 1: Choose Effect & Intensity */}
                <div className="accordion-section">
                  <button className="accordion-header" onClick={() => toggleGroup('effects')}>
                    <span className="accordion-label">1. Choose Effect &amp; Intensity</span>
                    <ChevronSVG isOpen={expandedGroups.effects} />
                  </button>
                  
                  {expandedGroups.effects && (
                    <div className="accordion-content">
                      <div className="effects-selector-grid-compact">
                        {effectsList.map((eff) => (
                          <button
                            key={eff.id}
                            className={`selector-btn-compact ${sandboxEffect === eff.id ? 'active' : ''}`}
                            onClick={() => setSandboxEffect(eff.id)}
                            title={eff.desc}
                          >
                            {eff.name}
                          </button>
                        ))}
                      </div>

                      {/* Display description for currently hovered/selected effect */}
                      <p className="effect-desc-inline">
                        {effectsList.find(e => e.id === sandboxEffect)?.desc}
                      </p>

                      <div className="control-subgroup">
                        <label className="control-sublabel">Intensity: {sandboxIntensity.toFixed(1)}×</label>
                        <div className="slider-row">
                          <input
                            type="range"
                            min={0}
                            max={2}
                            step={0.1}
                            value={sandboxIntensity}
                            onChange={(e) => setSandboxIntensity(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      {isLensEffect && (
                        <div className="lens-customizer-row">
                          <div className="control-subgroup flex-half">
                            <label className="control-sublabel">Lens Size: {sandboxLensSize}px</label>
                            <div className="slider-row">
                              <input
                                type="range"
                                min={60}
                                max={300}
                                step={10}
                                value={sandboxLensSize}
                                onChange={(e) => setSandboxLensSize(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <div className="control-subgroup flex-half">
                            <label className="control-sublabel">Lens Shape</label>
                            <div className="lens-shape-toggle-row">
                              {(['circle', 'square'] as const).map((shape) => (
                                <button
                                  key={shape}
                                  className={`shape-toggle-btn ${sandboxLensShape === shape ? 'active' : ''}`}
                                  onClick={() => setSandboxLensShape(shape)}
                                >
                                  {shape === 'circle' ? 'Circle' : 'Square'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accordion Group 2: Color Filters & Images */}
                <div className="accordion-section">
                  <button className="accordion-header" onClick={() => toggleGroup('aesthetics')}>
                    <span className="accordion-label">2. Color Filters &amp; Image Source</span>
                    <ChevronSVG isOpen={expandedGroups.aesthetics} />
                  </button>

                  {expandedGroups.aesthetics && (
                    <div className="accordion-content">
                      <div className="control-subgroup">
                        <label className="control-sublabel">Color Filter Preset</label>
                        <select 
                          className="custom-select-element"
                          value={sandboxFilter} 
                          onChange={(e) => setSandboxFilter(e.target.value as any)}
                        >
                          {filtersList.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="control-subgroup" style={{ marginTop: 12 }}>
                        <label className="control-sublabel">Preset Images</label>
                        <div className="preset-images-row-compact">
                          {imagePresets.map(preset => (
                            <button
                              key={preset.name}
                              className={`preset-img-btn-compact ${sandboxImg === preset.url ? 'active' : ''}`}
                              onClick={() => { setSandboxImg(preset.url); setCustomUrl(''); }}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="control-subgroup" style={{ marginTop: 12 }}>
                        <label className="control-sublabel">Custom Image URL</label>
                        <input
                          type="text"
                          className="custom-url-input-compact"
                          value={customUrl}
                          onChange={(e) => {
                            setCustomUrl(e.target.value);
                            if (e.target.value) setSandboxImg(e.target.value);
                          }}
                          placeholder="Paste a direct image URL..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion Group 3: Export Generated Code */}
                <div className="accordion-section">
                  <button className="accordion-header" onClick={() => toggleGroup('code')}>
                    <span className="accordion-label">3. Export Generated React Code</span>
                    <ChevronSVG isOpen={expandedGroups.code} />
                  </button>

                  {expandedGroups.code && (
                    <div className="accordion-content">
                      <div className="code-label-row-compact">
                        <button 
                          className="copy-code-btn-compact"
                          onClick={() => handleCopy(
                            `import { LensImage } from 'lensjs/react';\nimport 'lensjs/styles.css';\n\nfunction Demo() {\n  return (\n    <LensImage\n      src="${sandboxCodeSrc}"\n      alt="Demo Image"\n      effect="${sandboxEffect}"${sandboxEffect === 'reveal' ? `\n      revealSrc="/second-image.jpg"` : ''}${sandboxFilter !== 'none' ? `\n      filter="${sandboxFilter}"` : ''}${sandboxIntensity !== 1 ? `\n      intensity={${sandboxIntensity}}` : ''}${isLensEffect && sandboxLensSize !== 130 ? `\n      lensSize={${sandboxLensSize}}` : ''}${isLensEffect && sandboxLensShape !== 'circle' ? `\n      lensShape="${sandboxLensShape}"` : ''}\n      style={{ width: '100%', maxWidth: '400px', borderRadius: '16px' }}\n    />\n  );\n}`,
                            'sandbox-code'
                          )}
                        >
                          {copiedId === 'sandbox-code' ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy React Component Code</>}
                        </button>
                      </div>

                      <div className="code-block-container-compact">
                        <pre>
                          <code>
                            <span className="k">import</span> <span className="p">{"{"}</span> <span className="c">LensImage</span> <span className="p">{"}"}</span> <span className="k">from</span> <span className="s">'lensjs/react'</span><span className="p">;</span>{'\n'}
                            <span className="k">import</span> <span className="s">'lensjs/styles.css'</span><span className="p">;</span>{'\n\n'}
                            <span className="k">function</span> <span className="f">Demo</span><span className="p">()</span> <span className="p">{"{"}</span>{'\n'}
                            {'  '}<span className="k">return</span> <span className="p">(</span>{'\n'}
                            {'    '}<span className="p">&lt;</span><span className="c">LensImage</span>{'\n'}
                            {'      '}<span className="a">src</span><span className="p">=</span><span className="s">"{sandboxCodeSrc.length > 40 ? sandboxCodeSrc.substring(0, 37) + '...' : sandboxCodeSrc}"</span>{'\n'}
                            {'      '}<span className="a">alt</span><span className="p">=</span><span className="s">"Demo Image"</span>{'\n'}
                            {'      '}<span className="a">effect</span><span className="p">=</span><span className="s">"{sandboxEffect}"</span>{'\n'}
                            {sandboxEffect === 'reveal' && (
                              <>{'      '}<span className="a">revealSrc</span><span className="p">=</span><span className="s">"/second-image.jpg"</span>{'\n'}</>
                            )}
                            {sandboxFilter !== 'none' && (
                              <>{'      '}<span className="a">filter</span><span className="p">=</span><span className="s">"{sandboxFilter}"</span>{'\n'}</>
                            )}
                            {sandboxIntensity !== 1 && (
                              <>{'      '}<span className="a">intensity</span><span className="p">={'{'}</span><span className="n">{sandboxIntensity}</span><span className="p">{'}'}</span>{'\n'}</>
                            )}
                            {isLensEffect && sandboxLensSize !== 130 && (
                              <>{'      '}<span className="a">lensSize</span><span className="p">={'{'}</span><span className="n">{sandboxLensSize}</span><span className="p">{'}'}</span>{'\n'}</>
                            )}
                            {isLensEffect && sandboxLensShape !== 'circle' && (
                              <>{'      '}<span className="a">lensShape</span><span className="p">=</span><span className="s">"{sandboxLensShape}"</span>{'\n'}</>
                            )}
                            {'      '}<span className="a">style</span><span className="p">=</span><span className="p">{"{{"}</span> <span className="pr">width</span><span className="p">:</span> <span className="s">'100%'</span><span className="p">,</span> <span className="pr">maxWidth</span><span className="p">:</span> <span className="s">'400px'</span><span className="p">,</span> <span className="pr">borderRadius</span><span className="p">:</span> <span className="s">'16px'</span> <span className="p">{"}}"}</span>{'\n'}
                            {'    '}<span className="p">/&gt;</span>{'\n'}
                            {'  '}<span className="p">);</span>{'\n'}
                            <span className="p">{"}"}</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Documentation View */}
        {activeTab === 'docs' && (
          <div className="view-fade docs-layout">
            {/* Docs Sidebar */}
            <aside className="docs-sidebar">
              <div className="sidebar-group">
                <div className="sidebar-group-title">Getting Started</div>
                <a href="#intro" className="sidebar-link active">Introduction</a>
                <a href="#installation" className="sidebar-link">Installation</a>
                <a href="#usage" className="sidebar-link">Basic Usage</a>
              </div>
              <div className="sidebar-group">
                <div className="sidebar-group-title">Frameworks</div>
                <a href="#nextjs" className="sidebar-link">Next.js Integration</a>
              </div>
              <div className="sidebar-group">
                <div className="sidebar-group-title">API Reference</div>
                <a href="#props" className="sidebar-link">Props Schema</a>
                <a href="#lenses" className="sidebar-link">Lens Configuration</a>
                <a href="#color-filters" className="sidebar-link">Color Filters</a>
                <a href="#custom-css" className="sidebar-link">Custom CSS Variables</a>
              </div>
            </aside>

            {/* Docs Content */}
            <div className="docs-body">
              <section id="intro">
                <h2>Introduction</h2>
                <p>
                  <strong>LensJS</strong> is a lightweight, zero-dependency, and production-ready React component library that makes wrapping images in premium, visual interactive states incredibly simple.
                </p>
                <p>
                  Simple hover effects run on high-performance CSS transforms and hardware-accelerated filters. Distortion effects — vortex, fisheye, glitch, film grain, pixelate, de-noise and resolution boost — are true per-pixel image processing, rendered into a lightweight canvas overlay with zero dependencies.
                </p>
                <div className="doc-alert warning">
                  <div className="alert-title">Canvas effects &amp; cross-origin images</div>
                  <p>Pixel-processing effects need to read image data. For images from another domain, the server must allow CORS (LensJS automatically requests them with `crossOrigin="anonymous"`). If pixel access is blocked, the effect silently stays off and the image renders normally.</p>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="installation">
                <h2>Installation</h2>
                <p>Install the library using your package manager of choice:</p>
                <div className="code-block-header">
                  <span>Terminal</span>
                  <button className="copy-btn-small" onClick={() => handleCopy('npm install lensjs', 'doc-install')}>
                    {copiedId === 'doc-install' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="code-block-container">
                  <pre><code>npm install lensjs</code></pre>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="usage">
                <h2>Basic Usage</h2>
                <p>Import the `LensImage` wrapper together with the effect stylesheet (once, anywhere in your app), then apply one of the effects:</p>
                <div className="code-block-header">
                  <span>React (JSX/TSX)</span>
                  <button className="copy-btn-small" onClick={() => handleCopy(`import { LensImage } from 'lensjs/react';\nimport 'lensjs/styles.css';\n\nexport default function App() {\n  return (\n    <LensImage \n      src="/path/to/my-image.jpg" \n      alt="Spotlight Banner" \n      effect="glare" \n    />\n  );\n}`, 'doc-usage')}>
                    {copiedId === 'doc-usage' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="k">import</span> <span className="p">{"{"}</span> <span className="c">LensImage</span> <span className="p">{"}"}</span> <span className="k">from</span> <span className="s">'lensjs/react'</span><span className="p">;</span>{'\n'}
                      <span className="k">import</span> <span className="s">'lensjs/styles.css'</span><span className="p">;</span>{'\n\n'}
                      <span className="k">export</span> <span className="k">default</span> <span className="k">function</span> <span className="f">App</span><span className="p">()</span> <span className="p">{"{"}</span>{'\n'}
                      {'  '}<span className="k">return</span> <span className="p">(</span>{'\n'}
                      {'    '}<span className="p">&lt;</span><span className="c">LensImage</span>{'\n'}
                      {'      '}<span className="a">src</span><span className="p">=</span><span className="s">"/my-image.jpg"</span>{'\n'}
                      {'      '}<span className="a">alt</span><span className="p">=</span><span className="s">"Spotlight Banner"</span>{'\n'}
                      {'      '}<span className="a">effect</span><span className="p">=</span><span className="s">"glare"</span>{'\n'}
                      {'    '}<span className="p">/&gt;</span>{'\n'}
                      {'  '}<span className="p">);</span>{'\n'}
                      <span className="p">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="nextjs">
                <h2>Next.js Integration</h2>
                <p>
                  LensJS contains built-in `"use client"` indicators, enabling seamless compatibility with Next.js App Router projects.
                </p>
                <div className="doc-alert warning">
                  <div className="alert-title">Next.js Server Components (RSC)</div>
                  <p>You can import and place `<LensImage />` directly inside Next.js Server Components. It is pre-marked for client hydration, meaning you do not need to wrap your files in custom client boundaries.</p>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="props">
                <h2>Props Reference</h2>
                <p>The `<LensImage />` component extends all standard HTML image attributes (e.g. `src`, `alt`, `style`, `className`, `loading`, etc.) and supports the following custom props:</p>
                
                <div className="table-wrapper">
                  <table className="props-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code className="prop-name">effect</code></td>
                        <td><code>'zoom' | 'glare' | 'glass' | 'blur-vignette' | 'invert' | 'invert-full' | 'reveal' | 'neon' | 'vortex' | 'noise' | 'glitch' | 'fisheye' | 'pixelate' | 'denoise' | 'resolution-boost' | 'wave' | 'chromatic-aberration' | 'halftone' | 'posterize' | 'melt' | 'shadow' | 'heart-beat'</code></td>
                        <td><code>-</code></td>
                        <td>The interactive hover effect to render. Canvas-based pixel effects read and process image data in real-time.</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">filter</code></td>
                        <td><code>'bladerunner' | 'cyberpunk' | 'vintage' | 'sunset' | 'oceanic' | 'duotone-purple' | 'duotone-red' | 'duotone-cyan' | 'dreamy' | 'vintage-high' | 'amaro' | 'twilight-1' | 'twilight-2' | 'twilight-3' | 'matrix' | 'noir' | 'mad-max' | 'grayscale'</code></td>
                        <td><code>-</code></td>
                        <td>Movie-inspired color grading preset. Always applied and composes with any <code>effect</code>.</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">revealSrc</code></td>
                        <td><code>string</code></td>
                        <td><code>-</code></td>
                        <td>Second image shown inside the cursor lens when <code>effect="reveal"</code>.</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">intensity</code></td>
                        <td><code>number</code></td>
                        <td><code>1</code></td>
                        <td>Effect strength multiplier (0–2). Scales every effect: zoom amount, swirl angle, grain, shadow depth, etc. <code>0</code> disables the effect.</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">lensSize</code></td>
                        <td><code>number</code></td>
                        <td><code>130</code></td>
                        <td>Lens diameter in pixels for the lens effects (<code>invert</code>, <code>reveal</code>).</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">lensShape</code></td>
                        <td><code>'circle' | 'square'</code></td>
                        <td><code>'circle'</code></td>
                        <td>Shape of the cursor lens for <code>invert</code> and <code>reveal</code>.</td>
                      </tr>
                      <tr>
                        <td><code className="prop-name">...props</code></td>
                        <td><code>React.ImgHTMLAttributes</code></td>
                        <td><code>-</code></td>
                        <td>Accepts all native HTML `img` element attributes.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="lenses">
                <h2>Lens Configuration</h2>
                <p>
                  LensJS includes specialized cursor-following effects: <code>invert</code> and <code>reveal</code>. These effects track your mouse cursor coordinates and apply high-performance CSS clip-paths or backdrop-filters.
                </p>
                <p>
                  You can control the dimensions and outline style of these lenses using standard component props:
                </p>
                <ul>
                  <li><strong><code>lensSize</code></strong>: Renders a lens with a custom diameter or width/height (default is <code>130px</code>).</li>
                  <li><strong><code>lensShape</code></strong>: Configures the outline boundary. Setting this to <code>'square'</code> gives the lens a modern, rounded-corner card clip-path, while <code>'circle'</code> renders a clean circle.</li>
                  <li><strong><code>revealSrc</code></strong>: Used specifically with the <code>reveal</code> effect to supply a secondary image that is slowly revealed inside the lens boundary as the cursor sweeps.</li>
                </ul>
                <div className="code-block-header">
                  <span>Double Exposure Reveal Lens (JSX/TSX)</span>
                  <button className="copy-btn-small" onClick={() => handleCopy(`<LensImage\n  src="/foreground.jpg"\n  revealSrc="/background.jpg"\n  effect="reveal"\n  lensSize={180}\n  lensShape="square"\n/>`, 'doc-lens-ex')}>
                    Copy
                  </button>
                </div>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="p">&lt;</span><span className="c">LensImage</span>{'\n'}
                      {'  '}<span className="a">src</span><span className="p">=</span><span className="s">"/foreground.jpg"</span>{'\n'}
                      {'  '}<span className="a">revealSrc</span><span className="p">=</span><span className="s">"/background.jpg"</span>{'\n'}
                      {'  '}<span className="a">effect</span><span className="p">=</span><span className="s">"reveal"</span>{'\n'}
                      {'  '}<span className="a">lensSize</span><span className="p">={'{'}</span><span className="n">180</span><span className="p">{'}'}</span>{'\n'}
                      {'  '}<span className="a">lensShape</span><span className="p">=</span><span className="s">"square"</span>{'\n'}
                      <span className="p">/&gt;</span>
                    </code>
                  </pre>
                </div>
                
                <h3 style={{ marginTop: '24px', fontSize: '18px', color: 'var(--text-bright)' }}>Global Configurations &amp; Theme Overrides</h3>
                <p>
                  To avoid repeating props on every instance, you can define global default configurations (such as lens dimensions, default intensities, or shapes) using the <code>LensProvider</code> React Context. This is extremely useful for syncing lens settings dynamically with your application's light/dark mode theme using JavaScript:
                </p>
                <div className="code-block-header">
                  <span>Dynamic Theme Config (JSX/TSX)</span>
                  <button className="copy-btn-small" onClick={() => handleCopy(`import { LensProvider, LensImage } from 'lensjs/react';\n\nfunction App() {\n  const [theme, setTheme] = useState('dark');\n\n  // Sync lens config variables dynamically with JS theme state\n  const lensConfig = {\n    lensSize: theme === 'dark' ? 180 : 130,\n    lensShape: (theme === 'dark' ? 'square' : 'circle') as const,\n    intensity: 1.2\n  };\n\n  return (\n    <LensProvider value={lensConfig}>\n      <div className="app-content">\n        <LensImage src="/avatar.jpg" effect="invert" />\n      </div>\n    </LensProvider>\n  );\n}`, 'doc-lens-provider')}>
                    Copy
                  </button>
                </div>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="k">import</span> <span className="p">{"{"}</span> <span className="c">LensProvider</span><span className="p">,</span> <span className="c">LensImage</span> <span className="p">{"}"}</span> <span className="k">from</span> <span className="s">'lensjs/react'</span><span className="p">;</span>{'\n\n'}
                      <span className="k">function</span> <span className="f">App</span><span className="p">()</span> <span className="p">{"{"}</span>{'\n'}
                      {'  '}<span className="k">const</span> <span className="p">[</span><span className="pr">theme</span><span className="p">]</span> <span className="p">=</span> <span className="f">useState</span><span className="p">(</span><span className="s">'dark'</span><span className="p">);</span>{'\n\n'}
                      {'  '}<span className="co">// Sync lens variables dynamically with JS theme state</span>{'\n'}
                      {'  '}<span className="k">const</span> <span className="pr">lensConfig</span> <span className="p">=</span> <span className="p">{"{"}</span>{'\n'}
                      {'    '}<span className="pr">lensSize</span><span className="p">:</span> <span className="pr">theme</span> <span className="p">===</span> <span className="s">'dark'</span> <span className="p">?</span> <span className="n">180</span> <span className="p">:</span> <span className="n">130</span><span className="p">,</span>{'\n'}
                      {'    '}<span className="pr">lensShape</span><span className="p">:</span> <span className="pr">theme</span> <span className="p">===</span> <span className="s">'dark'</span> <span className="p">?</span> <span className="s">'square'</span> <span className="p">:</span> <span className="s">'circle'</span><span className="p">,</span>{'\n'}
                      {'    '}<span className="pr">intensity</span><span className="p">:</span> <span className="n">1.2</span>{'\n'}
                      {'  '}<span className="p">{"}"}</span><span className="p">;</span>{'\n\n'}
                      {'  '}<span className="k">return</span> <span className="p">(</span>{'\n'}
                      {'    '}<span className="p">&lt;</span><span className="c">LensProvider</span> <span className="a">value</span><span className="p">=</span><span className="p">{"{"}</span><span className="pr">lensConfig</span><span className="p">{"}"}</span><span className="p">&gt;</span>{'\n'}
                      {'      '}<span className="p">&lt;</span><span className="c">LensImage</span> <span className="a">src</span><span className="p">=</span><span className="s">"/avatar.jpg"</span> <span className="a">effect</span><span className="p">=</span><span className="s">"invert"</span> <span className="p">/&gt;</span>{'\n'}
                      {'    '}<span className="p">&lt;</span><span className="p">/</span><span className="c">LensProvider</span><span className="p">&gt;</span>{'\n'}
                      {'  '}<span className="p">);</span>{'\n'}
                      <span className="p">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="color-filters">
                <h2>Color Filters</h2>
                <p>
                  The <code>filter</code> prop applies a permanent, movie-inspired color grade to the image. Unlike <code>effect</code> (which reacts to hover), a filter is always on, and the two can be combined freely:
                </p>
                <div className="code-block-header">
                  <span>React (JSX/TSX)</span>
                  <button className="copy-btn-small" onClick={() => handleCopy(`<LensImage\n  src="/poster.jpg"\n  alt="Poster"\n  effect="zoom"\n  filter="bladerunner"\n/>`, 'doc-filter')}>
                    {copiedId === 'doc-filter' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="p">&lt;</span><span className="c">LensImage</span>{'\n'}
                      {'  '}<span className="a">src</span><span className="p">=</span><span className="s">"/poster.jpg"</span>{'\n'}
                      {'  '}<span className="a">alt</span><span className="p">=</span><span className="s">"Poster"</span>{'\n'}
                      {'  '}<span className="a">effect</span><span className="p">=</span><span className="s">"zoom"</span>{'\n'}
                      {'  '}<span className="a">filter</span><span className="p">=</span><span className="s">"bladerunner"</span>{'\n'}
                      <span className="p">/&gt;</span>
                    </code>
                  </pre>
                </div>
                <div className="table-wrapper">
                  <table className="props-table">
                    <thead>
                      <tr>
                        <th>Preset</th>
                        <th>Inspired by / Theme</th>
                        <th>Look</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><code>bladerunner</code></td><td>Blade Runner 2049</td><td>Neon teal &amp; orange, crushed contrast</td></tr>
                      <tr><td><code>cyberpunk</code></td><td>Cyberpunk / Neon City</td><td>Saturated neon pink &amp; cyan tones</td></tr>
                      <tr><td><code>vintage</code></td><td>Polaroid / Retro</td><td>Warm nostalgia sepia with faded low contrast</td></tr>
                      <tr><td><code>sunset</code></td><td>Aesthetic Sunset</td><td>Golden hour glow with rich red &amp; orange grading</td></tr>
                      <tr><td><code>oceanic</code></td><td>Deep Ocean</td><td>Cold cyan &amp; teal undertones with lowered exposure</td></tr>
                      <tr><td><code>duotone-purple</code></td><td>Duotone Tint</td><td>Saturated purple and magenta shadow mapping</td></tr>
                      <tr><td><code>duotone-red</code></td><td>Duotone Tint</td><td>Saturated high-contrast deep red tones</td></tr>
                      <tr><td><code>duotone-cyan</code></td><td>Duotone Tint</td><td>Saturated icy cold cyan &amp; blue styling</td></tr>
                      <tr><td><code>dreamy</code></td><td>Soft Bloom</td><td>Warm, low-contrast focus with a dreamy glow</td></tr>
                      <tr><td><code>vintage-high</code></td><td>Warm Film</td><td>High-contrast nostalgic warm sepia film look</td></tr>
                      <tr><td><code>amaro</code></td><td>Retro Washed</td><td>Vintage amaro photo filter style desaturated colors</td></tr>
                      <tr><td><code>twilight-1</code></td><td>Twilight</td><td>Cold, desaturated blue</td></tr>
                      <tr><td><code>twilight-2</code></td><td>New Moon</td><td>Warm golden hour</td></tr>
                      <tr><td><code>twilight-3</code></td><td>Eclipse</td><td>Muted, darker shadows</td></tr>
                      <tr><td><code>matrix</code></td><td>The Matrix</td><td>Phosphor green</td></tr>
                      <tr><td><code>noir</code></td><td>Sin City</td><td>Harsh high-contrast monochrome</td></tr>
                      <tr><td><code>mad-max</code></td><td>Mad Max: Fury Road</td><td>Scorched desert orange</td></tr>
                      <tr><td><code>grayscale</code></td><td>—</td><td>Plain black &amp; white</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="docs-divider" />

              <section id="custom-css">
                <h2>Custom CSS Extensions</h2>
                <p>
                  LensJS automatically applies a `.lens-image-wrapper` class and a `data-lens-effect` attribute to the wrapping node. You can easily tweak or override transitions in your own stylesheet:
                </p>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="co">/* Override Zoom intensity in your local stylesheet */</span>{'\n'}
                      <span className="c">.lens-image-wrapper</span><span className="p">[</span><span className="a">data-lens-effect</span><span className="p">=</span><span className="s">"zoom"</span><span className="p">]:</span><span className="a">hover</span> <span className="c">img</span> <span className="p">{"{"}</span>{'\n'}
                      {'  '}<span className="pr">transform</span><span className="p">:</span> <span className="f">scale</span><span className="p">(</span><span className="n">1.25</span><span className="p">);</span> <span className="co">/* Default is 1.2 */</span>{'\n'}
                      {'  '}<span className="pr">filter</span><span className="p">:</span> <span className="f">brightness</span><span className="p">(</span><span className="n">1.05</span><span className="p">);</span>{'\n'}
                      <span className="p">{"}"}</span>
                    </code>
                  </pre>
                </div>
                <p>
                  The <code>invert</code> effect renders a circular lens that follows your cursor and inverts every color beneath it. Its diameter is controlled by the <code>--lens-size</code> CSS variable (default <code>130px</code>):
                </p>
                <div className="code-block-container">
                  <pre>
                    <code>
                      <span className="co">/* Make the invert lens larger */</span>{'\n'}
                      <span className="c">.lens-image-wrapper</span><span className="p">[</span><span className="a">data-lens-effect</span><span className="p">=</span><span className="s">"invert"</span><span className="p">]</span> <span className="p">{"{"}</span>{'\n'}
                      {'  '}<span className="pr">--lens-size</span><span className="p">:</span> <span className="n">200px</span><span className="p">;</span>{'\n'}
                      <span className="p">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Examples View */}
        {activeTab === 'examples' && (
          <div className="view-fade examples-container">
            <div className="examples-header">
              <h2>Examples Showcase</h2>
              <p>Real-world interactive templates showing LensJS elements integrated with responsive interface designs.</p>
            </div>

            <div className="examples-grid">
              {/* Card 1: E-Commerce Product Card */}
              <div className="example-demo-card">
                <div className="demo-card-preview">
                  <LensImage
                    src="/ikiru.jpg"
                    alt="Ikiru Glare Banner"
                    effect="glare"
                    className="demo-card-img"
                  />
                  <div className="demo-card-tag">Glare Effect</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">Silver Screen</div>
                  <h4 className="demo-card-title">Ikiru — Glare Sweep</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Hover to Shine</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Glass Film Card */}
              <div className="example-demo-card">
                <div className="demo-card-preview">
                  <LensImage 
                    src="/lotr.jpg" 
                    alt="Lord of the Rings Movie Banner" 
                    effect="glass" 
                    className="demo-card-img"
                  />
                  <div className="demo-card-tag">Glass Frame</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">Cinema Classic</div>
                  <h4 className="demo-card-title">The Lord of the Rings</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Watch Trailer</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Cyberpunk NFT Card */}
              <div className="example-demo-card">
                <div className="demo-card-preview">
                  <LensImage
                    src="/lotr.jpg"
                    alt="Lord of the Rings Neon Banner"
                    effect="neon"
                    className="demo-card-img"
                  />
                  <div className="demo-card-tag">Neon Spotlight</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">Epic Fantasy</div>
                  <h4 className="demo-card-title">The Fellowship — Neon Frame</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Hover to Glow</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Invert Negative Card */}
              <div className="example-demo-card">
                <div className="demo-card-preview">
                  <LensImage
                    src="/lotr.jpg"
                    alt="Lord of the Rings Inverted Colors"
                    effect="invert"
                    className="demo-card-img"
                  />
                  <div className="demo-card-tag">Invert Lens</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">Photo Negative</div>
                  <h4 className="demo-card-title">Middle-earth, Negative</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Move the Lens</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Portrait Gallery Item */}
              <div className="example-demo-card">
                <div className="demo-card-preview">
                  <LensImage 
                    src="/ikiru.jpg" 
                    alt="Ikiru Film Banner" 
                    effect="blur-vignette" 
                    className="demo-card-img"
                  />
                  <div className="demo-card-tag">Blur Vignette</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">Classic Masterpiece</div>
                  <h4 className="demo-card-title">Ikiru (To Live) - 1952</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Read Review</span>
                  </div>
                </div>
              </div>

              {/* Card 6: Button Glitch Showcase */}
              <div className="example-demo-card">
                <div className="demo-card-preview" style={{ background: '#080a10', padding: '60px 20px', minHeight: '200px' }}>
                  <LensImage effect="glitch" style={{ cursor: 'pointer' }}>
                    <button className="add-to-cart-btn" style={{ margin: 0, padding: '12px 24px', fontSize: '15px' }}>
                      GLITCH BUTTON
                    </button>
                  </LensImage>
                  <div className="demo-card-tag" style={{ background: '#ec4899' }}>Element Wrap</div>
                </div>
                <div className="demo-card-info">
                  <div className="demo-card-category">CSS Glitch Fallback</div>
                  <h4 className="demo-card-title">Glitch Arbitrary Elements</h4>
                  <div className="demo-card-price-row">
                    <span className="watch-btn">Hover Button to Glitch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-left" style={{ display: 'flex', alignItems: 'center' }}>
          <LensLogoSVG size={18} />
          <span>lensjs &copy; {new Date().getFullYear()} — MIT Licensed.</span>
        </div>
        <div className="footer-right">
          Designed for elite React and Next.js user interfaces.
        </div>
      </footer>
    </div>
  );
}

export default App;
