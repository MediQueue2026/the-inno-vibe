import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { projects } from '../projects.js';
import ProjectVisual from './ProductPreviews.jsx';

const stages = ['Requirement analysis', 'Design', 'Development', 'Testing', 'Launch'];

// Maps a project's status text to its step in the delivery timeline.
const stageIndex = status => /requirement|analysis/i.test(status) ? 0
  : /design/i.test(status) ? 1
  : /develop/i.test(status) ? 2
  : /test|qa/i.test(status) ? 3
  : /launch|live|released/i.test(status) ? 4
  : 0;

const statusDot = status => status === 'In development' ? 'development-dot' : 'analysis-dot';

// Tabbed showcase of the products. Links to #<project id> select and reveal that product.
export default function SystemsShowcase() {
  const { hash } = useLocation();
  const [active, setActive] = useState(projects[0].id);
  const tabRefs = useRef({});

  useEffect(() => {
    const id = hash.slice(1);
    if (projects.some(project => project.id === id)) setActive(id);
  }, [hash]);

  const index = projects.findIndex(project => project.id === active);
  const project = projects[index];
  const current = stageIndex(project.status);

  const onKeyDown = event => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = projects[(index + step + projects.length) % projects.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div className="showcase">
      <div className="showcase-tabs" role="tablist" aria-label="Our systems">
        {projects.map(item => (
          <button
            key={item.id}
            ref={element => { tabRefs.current[item.id] = element; }}
            id={item.id}
            className={`showcase-tab ${item.id}`}
            role="tab"
            type="button"
            aria-selected={item.id === active}
            aria-controls="showcase-panel"
            tabIndex={item.id === active ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={onKeyDown}
          >
            <span className={`product-icon ${item.iconClass}`} aria-hidden="true">{item.icon}</span>
            <span className="showcase-tab-text">
              <strong>{item.title}</strong>
              <small><i className={statusDot(item.status)}></i> {item.domain}</small>
            </span>
          </button>
        ))}
      </div>

      <div id="showcase-panel" className={`showcase-panel ${project.id}`} role="tabpanel" aria-labelledby={project.id} key={project.id}>
        <div className="showcase-visual"><ProjectVisual project={project} index={index} /></div>

        <div className="showcase-body">
          <div className="showcase-head">
            <span className="category">{project.category}</span>
            <span className="project-tag"><i className={statusDot(project.status)}></i> {project.status}</span>
          </div>
          <h3>{project.title}<span className="product-mark">.</span></h3>
          <p className="showcase-lead">{project.description}</p>
          <div className="showcase-columns">
            <div className="showcase-challenge">
              <h4>The challenge</h4>
              <p>{project.challenge}</p>
            </div>
            <div>
              <h4>What we’re focusing on</h4>
              <ul className="focus-list">
                {project.focus.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <ol className="stage-track" aria-label={`${project.title} progress`}>
          {stages.map((stage, step) => (
            <li
              key={stage}
              className={step < current ? 'is-done' : step === current ? 'is-current' : undefined}
              aria-current={step === current ? 'step' : undefined}
              style={{ '--s': step }}
            >
              <span className="stage-dot" aria-hidden="true">{step < current ? '✓' : step + 1}</span>
              <span className="stage-label">{stage}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
