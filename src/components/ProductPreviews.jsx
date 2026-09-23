function QueuePreview() {
  return (
    <div className="queue-preview" aria-label="Illustrative MediQueue interface">
      <div className="preview-heading"><span className="mini-brand"><span className="product-mark">✚</span> MediQueue</span><span className="live-badge"><i></i> Queue overview</span></div>
      <div className="queue-body">
        <div className="now-serving"><span>NOW SERVING</span><strong>A024</strong><small>Consultation room 01</small></div>
        <div className="queue-list">
          <div><span>Up next</span><span>Queue no.</span></div>
          {['A025', 'A026', 'A027'].map(number => <div key={number}><span><i></i> Waiting</span><strong>{number}</strong></div>)}
        </div>
      </div>
      <div className="preview-footer"><span><i className="status-dot"></i> A smoother patient journey</span><span aria-hidden="true">↗</span></div>
    </div>
  );
}

function HomePreview() {
  return (
    <div className="home-preview" aria-label="Illustrative sahakara interface">
      <div className="preview-heading"><span className="mini-brand"><span className="product-mark">⌂</span> sahakara</span><span className="home-chip">Your home, in sync</span></div>
      <div className="home-greeting">A little more organized.<span>A little more peace of mind.</span></div>
      <div className="task-row"><span className="task-icon" aria-hidden="true">✓</span><div><strong>Household tasks</strong><small>Keep the everyday in order</small></div><span className="task-check" aria-hidden="true">✓</span></div>
      <div className="task-row"><span className="task-icon" aria-hidden="true">◷</span><div><strong>Help that fits your routine</strong><small>Bring clarity to your day</small></div><span className="task-arrow" aria-hidden="true">↗</span></div>
    </div>
  );
}

function LabPreview() {
  return (
    <div className="lab-preview" aria-label="Illustrative Virtual Chem Lab interface">
      <div className="preview-heading"><span className="mini-brand"><span className="product-mark">⚗&#xFE0E;</span> Virtual Chem Lab</span><span className="lab-chip">A/L Chemistry</span></div>
      <div className="lab-body">
        <div className="lab-bench" aria-hidden="true"><span className="flask"><i></i></span><span className="lab-reading">pH 7.0</span></div>
        <div className="lab-steps">
          <small>EXPERIMENT</small>
          <strong>Acid–base titration</strong>
          <div><span className="task-icon" aria-hidden="true">✓</span> Add indicator</div>
          <div><span className="task-icon" aria-hidden="true">◷</span> Titrate slowly</div>
        </div>
      </div>
    </div>
  );
}

const previews = { mediqueue: QueuePreview, sahakara: HomePreview, chemlab: LabPreview };

// The illustrated interface concept for a project, with its topline.
export default function ProjectVisual({ project, index }) {
  const Preview = previews[project.id];
  return (
    <div className={`project-visual ${project.id}`}>
      <div className="visual-topline">
        <span className={`product-icon ${project.iconClass}`} aria-hidden="true">{project.icon}</span>
        <span>{project.tagline}</span>
        <span className="visual-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <Preview />
      <span className="concept-label">INTERFACE CONCEPT</span>
    </div>
  );
}
