import { useState } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { team } from '../team.js';
import { Link } from 'react-router';
import PageHero from '../components/PageHero.jsx';

const initials = name => name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase();

const skills = ['Product design', 'Software engineering', 'Web development', 'Digital transformation'];

// Groups a member by their title, so filters stay right when roles change in team.js.
const disciplineOf = role => /qa|quality|test/i.test(role) ? 'Quality'
  : /manager|lead|owner|coordinator/i.test(role) ? 'Management'
  : 'Engineering';

const roleIcons = {
  database: <><ellipse cx="12" cy="5.5" rx="7" ry="2.8" /><path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13" /><path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  stack: <><path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" /></>,
  quality: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2.8h6V4" /><path d="m8.5 12.5 2.3 2.3 4.7-4.8" /></>,
  manager: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /><path d="M5.5 8h1.5M11 8h2M11 11.5h2M17 8h1.5M17 11.5h1.5M17 15h1.5" /></>,
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /><path d="m13.5 4-3 16" /></>
};
const iconFor = role => /data/i.test(role) ? 'database'
  : /full ?stack/i.test(role) ? 'stack'
  : /qa|quality|test/i.test(role) ? 'quality'
  : /manager|lead|owner/i.test(role) ? 'manager'
  : 'code';

function RoleIcon({ role, size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {roleIcons[iconFor(role)]}
    </svg>
  );
}

function MemberCard({ member, index }) {
  const discipline = disciplineOf(member.role).toLowerCase();
  return (
    <article className={`member-card is-${discipline}`} style={{ '--i': index }}>
      <div className="member-cover" aria-hidden="true">
        <span className="member-cover-icon"><RoleIcon role={member.role} size={96} /></span>
      </div>
      {member.photo
        ? <img className="member-avatar" src={member.photo} alt="" width="84" height="84" />
        : <span className="member-avatar" aria-hidden="true">{initials(member.name)}</span>}
      <div className="member-body">
        <h3>{member.name}</h3>
        <span className="member-role"><RoleIcon role={member.role} /> {member.role}</span>
        <p>{member.bio}</p>
        {member.linkedin && (
          <a className="member-link" href={member.linkedin} target="_blank" rel="noopener" aria-label={`${member.name} on LinkedIn`}>
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

function TeamDirectory() {
  const [filter, setFilter] = useState('All');
  const groups = ['All', ...['Engineering', 'Quality', 'Management'].filter(group => team.some(member => disciplineOf(member.role) === group))];
  const shown = filter === 'All' ? team : team.filter(member => disciplineOf(member.role) === filter);
  const roleCount = new Set(team.map(member => member.role)).size;

  return (
    <div className="team-directory" id="members">
      <div className="team-toolbar">
        <p className="team-summary"><strong>{team.length} people</strong> · {roleCount} roles · one shared vibe</p>
        <div className="team-filters" role="group" aria-label="Filter the team by discipline">
          {groups.map(group => {
            const count = group === 'All' ? team.length : team.filter(member => disciplineOf(member.role) === group).length;
            return (
              <button key={group} type="button" aria-pressed={filter === group} onClick={() => setFilter(group)}>
                {group} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">Showing {shown.length} of {team.length} team members</p>
      <div className="team-cards" key={filter}>
        {shown.map((member, index) => <MemberCard key={member.name} member={member} index={index} />)}
      </div>
    </div>
  );
}

// Background for the team hero: two quiet network clusters (people connected by lines)
// either side of the headline, and soft drifting glows. Purely decorative.
const networkNodes = [[40, 70], [150, 36], [250, 112], [96, 176], [206, 236], [56, 300], [168, 350], [272, 300]];
const networkLinks = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6], [4, 7], [6, 7]];
const pulsingNodes = new Set([1, 4, 6]);

function Network({ side }) {
  return (
    <svg className={`team-network team-network-${side}`} viewBox="0 0 320 400">
      {networkLinks.map(([a, b], index) => (
        <line key={index} x1={networkNodes[a][0]} y1={networkNodes[a][1]} x2={networkNodes[b][0]} y2={networkNodes[b][1]} pathLength="1" style={{ '--i': index }} />
      ))}
      {networkNodes.map(([x, y], index) => (
        <g key={index} style={{ '--i': index }}>
          {pulsingNodes.has(index) && <circle className="node-pulse" cx={x} cy={y} r="7" />}
          <circle className={pulsingNodes.has(index) ? 'node node-key' : 'node'} cx={x} cy={y} r={pulsingNodes.has(index) ? 7 : 4} />
        </g>
      ))}
    </svg>
  );
}

function TeamDecor() {
  return (
    <div className="team-decor">
      <span className="team-glow team-glow-1"></span>
      <span className="team-glow team-glow-2"></span>
      <Network side="left" />
      <Network side="right" />
    </div>
  );
}

function SkillsMarquee() {
  const items = [...skills, ...skills, ...skills, ...skills];
  return (
    <div className="skills-marquee" aria-label="What the team brings">
      <ul className="sr-only">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
      <div className="marquee-track" aria-hidden="true">
        {items.map((skill, index) => <span key={index}>{skill}<i>✦</i></span>)}
      </div>
    </div>
  );
}

export default function Team() {
  usePageTitle('Our team');
  return (
    <>
      <PageHero
        variant="team"
        eyebrow="OUR TEAM"
        crumb="Our team"
        title={<>The people<br /><span className="gradient-text">behind the vibe.</span></>}
        actions={<>
          <a className="button button-primary" href="#join">Join our team <span aria-hidden="true">↓</span></a>
          <Link className="button button-secondary" to="/about">About TheInnoVibe</Link>
        </>}
        visual={<TeamDirectory />}
        decor={<TeamDecor />}
        footer={<SkillsMarquee />}
      >
        A small team that brings product design and software engineering together to build technology with purpose.
      </PageHero>

      <section className="page-section section-wrap" id="join">
        <Reveal className="info-card join-card">
          <div>
            <h3>Want to build with us?</h3>
            <p>We’re always happy to hear from people who care about purposeful technology.</p>
          </div>
          <a className="button button-primary" href="mailto:theinnovibe@gmail.com">Get in touch <span aria-hidden="true">↗</span></a>
        </Reveal>
      </section>
    </>
  );
}
