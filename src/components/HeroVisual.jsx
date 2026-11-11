import { useState, useEffect, useRef } from 'react';

const PILLARS = [
  {
    id: 'think',
    step: '01',
    label: 'THINK',
    tagline: 'Spark the vision',
    description: 'Explore challenges, clarify goals, and shape crisp product concepts.',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
      </svg>
    )
  },
  {
    id: 'build',
    step: '02',
    label: 'BUILD',
    tagline: 'Craft the experience',
    description: 'Design and engineer fast, intuitive apps and platforms that just work.',
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    )
  },
  {
    id: 'vibe',
    step: '03',
    label: 'VIBE',
    tagline: 'Bring it to life',
    description: 'Ship with polish, character, and care so people truly love using it.',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.45)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  }
];

export default function HeroVisual() {
  const [activePillar, setActivePillar] = useState('think');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Smooth mouse tilt effect for interactive depth
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const active = PILLARS.find(p => p.id === activePillar) || PILLARS[0];

  return (
    <div
      ref={containerRef}
      className="hero-vibe-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
      }}
      aria-label="Interactive Think, Build, Vibe experience"
    >
      {/* Ambient Radial Aura */}
      <div 
        className="vibe-aura" 
        style={{
          background: `radial-gradient(circle at center, ${active.glow} 0%, rgba(3, 8, 23, 0) 70%)`
        }}
        aria-hidden="true"
      />

      {/* Interactive Pillars Nav */}
      <div className="vibe-pillars-list" role="tablist" aria-label="Our philosophy">
        {PILLARS.map((p) => {
          const isSelected = p.id === activePillar;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isSelected}
              className={`vibe-pillar-pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => setActivePillar(p.id)}
              onMouseEnter={() => setActivePillar(p.id)}
              style={{
                '--pill-color': p.color,
                '--pill-glow': p.glow
              }}
            >
              <div className="pillar-icon-badge" style={{ color: p.color }}>
                {p.icon}
              </div>
              <div className="pillar-text-group">
                <div className="pillar-header-row">
                  <span className="pillar-step">{p.step}</span>
                  <span className="pillar-title">{p.label}</span>
                </div>
                <span className="pillar-tagline">{p.tagline}</span>
              </div>
              {isSelected && <span className="pillar-active-pip" style={{ background: p.color }} />}
            </button>
          );
        })}
      </div>

      {/* Active Story Card - Written in friendly human language */}
      <div className="vibe-story-card">
        <div className="story-card-top">
          <span className="story-card-badge" style={{ color: active.color, borderColor: `${active.color}55` }}>
            {active.label} &bull; STEP {active.step}
          </span>
          <span className="story-live-status">Interactive &bull; Tap a step</span>
        </div>
        <p className="story-card-desc">{active.description}</p>
      </div>
    </div>
  );
}

