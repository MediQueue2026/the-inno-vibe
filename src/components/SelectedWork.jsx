import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { projects } from '../projects.js';
import ProjectVisual from './ProductPreviews.jsx';

const statusDot = status => status === 'In development' ? 'development-dot'
  : /test|qa/i.test(status) ? 'testing-dot'
  : 'analysis-dot';

// A real, checkable result for a launched project (see `outcome` in projects.js).
function Outcome({ outcome }) {
  return (
    <figure className="work-outcome">
      <div className="work-outcome-metric">
        <strong>{outcome.value}</strong>
        <span>{outcome.label}</span>
      </div>
      {outcome.quote && <blockquote>“{outcome.quote}”</blockquote>}
      {(outcome.attribution || outcome.context) && (
        <figcaption>{[outcome.attribution, outcome.context].filter(Boolean).join(' · ')}</figcaption>
      )}
    </figure>
  );
}

// Where the project honestly stands, said plainly rather than as a progress bar.
function StageNote({ project }) {
  return (
    <p className="work-stage-note">
      <span className="work-stage-label"><i className={statusDot(project.status)} aria-hidden="true"></i>{project.stage.label}</span>
      <span>{project.stage.note}</span>
    </p>
  );
}

const livePreviews = projects.filter(project => project.liveUrl).length;
const countWord = n => ['No', 'One', 'Two', 'Three', 'Four', 'Five'][n] ?? String(n);

export default function SelectedWork({ number = '02' }) {
  return (
    <section className="selected-work section-wrap" id="work">
      <span className="eyebrow"><span className="section-number">{number} /</span> SELECTED WORK</span>
      <Reveal className="approach-heading work-heading">
        <h2>Ideas we&apos;ve turned into systems<span className="cyan">.</span></h2>
        <div className="work-heading-side">
          <p>
            {countWord(projects.length)} products of our own, each at a different stage.
            {livePreviews > 0 && ` ${livePreviews === projects.length ? 'All' : countWord(livePreviews)} ${livePreviews === 1 ? 'has a public build' : 'have public builds'} you can open today.`}
          </p>
          <Link className="work-all-link" to="/domains#systems">
            See every project&apos;s stage <span aria-hidden="true">→</span>
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
              <dl className="work-facts">
                <div><dt>For</dt><dd>{project.audience}</dd></div>
                <div><dt>Problem</dt><dd>{project.challenge}</dd></div>
              </dl>
              <div className="work-card-foot">
                {project.outcome ? <Outcome outcome={project.outcome} /> : <StageNote project={project} />}
                <div className="work-card-actions">
                  {project.liveUrl && (
                    <a
                      className="work-live-btn"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{project.previewLabel ?? 'Open'}</span>
                      <span className="live-arrow" aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens {project.title} in a new tab)</span>
                    </a>
                  )}
                  <Link className="work-cta" to={`/domains#${project.id}`} aria-label={`How we're approaching ${project.title}`}>
                    <span className="work-cta-label">Our approach</span>
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
