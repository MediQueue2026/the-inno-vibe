import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { projects } from '../projects.js';
import ProjectVisual from './ProductPreviews.jsx';

// The journey every system goes through; used to show how far along each one is.
const stages = ['Requirement analysis', 'In development', 'Testing', 'Launch'];

function StageTracker({ status }) {
  const current = Math.max(0, stages.findIndex(stage => stage.toLowerCase() === status.toLowerCase()));
  return (
    <div className="work-stage">
      <div className="work-stage-head">
        <span>Stage {current + 1} of {stages.length}</span>
        <strong>{status}</strong>
      </div>
      <div
        className="work-stage-bar"
        role="progressbar"
        aria-label="Project stage"
        aria-valuemin={1}
        aria-valuemax={stages.length}
        aria-valuenow={current + 1}
        aria-valuetext={status}
      >
        {stages.map((stage, index) => (
          <span
            key={stage}
            className={index < current ? 'is-done' : index === current ? 'is-current' : undefined}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section className="selected-work section-wrap" id="work">
      <span className="eyebrow"><span className="section-number">02 /</span> SELECTED WORK</span>
      <Reveal className="approach-heading work-heading">
        <h2>Ideas we&apos;ve turned into systems<span className="cyan">.</span></h2>
        <div className="work-heading-side">
          <p>Early product thinking, shaped around real people and the problems they face.</p>
          <Link className="work-all-link" to="/domains#systems">
            Explore all systems <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
      <div className="work-grid">
        {projects.map((project, index) => (
          <Reveal
            as="article"
            key={project.id}
            className={`work-card work-card-${index + 1} ${project.id}`}
          >
            <Link className="work-visual-link" to={`/domains#${project.id}`} tabIndex={-1} aria-hidden="true">
              <ProjectVisual project={project} index={index} />
            </Link>
            <div className="work-card-copy">
              <div className="work-meta">
                <span className="work-category">{project.category}</span>
                <span className="work-domain">{project.domain}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="work-card-foot">
                <StageTracker status={project.status} />
                <div className="work-card-actions">
                  {project.liveUrl && (
                    <a
                      className="work-live-btn"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${project.title} live system`}
                    >
                      <span>Visit site</span>
                      <span className="live-arrow" aria-hidden="true">↗</span>
                    </a>
                  )}
                  <Link className="work-cta" to={`/domains#${project.id}`} aria-label={`View ${project.title} case study`}>
                    <span className="work-cta-label">Case study</span>
                    <span className="work-cta-icon" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
