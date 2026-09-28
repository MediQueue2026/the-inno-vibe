import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { projects } from '../projects.js';
import ProjectVisual from './ProductPreviews.jsx';

export default function SelectedWork() {
  return (
    <section className="selected-work section-wrap" id="work">
      <span className="eyebrow"><span className="section-number">02 /</span> SELECTED WORK</span>
      <Reveal className="approach-heading">
        <h2>Ideas we&apos;ve turned into systems<span className="cyan">.</span></h2>
        <p>Early product thinking, shaped around real people and the problems they face.</p>
      </Reveal>
      <div className="work-grid">
        {projects.map((project, index) => (
          <Reveal
            as="article"
            key={project.id}
            className={`work-card work-card-${index + 1} ${project.id}`}
          >
            <Link className="work-visual-link" to={`/domains#${project.id}`} aria-label={`View ${project.title} case study`}>
              <ProjectVisual project={project} index={index} />
            </Link>
            <div className="work-card-copy">
              <span className="work-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="work-tags">
                <span>{project.domain}</span>
                <span>{project.status}</span>
              </div>
              <Link className="text-link" to={`/domains#${project.id}`}>
                View Case Study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
