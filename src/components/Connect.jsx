import { Reveal } from '../hooks/useReveal.jsx';

export default function Connect() {
  return (
    <section className="connect" id="connect">
      {/* Animated deep space background */}
      <div className="connect-bg"></div>
      <div className="connect-bg-overlay"></div>
      
      <Reveal className="connect-panel section-wrap">
        <div className="connect-copy">
          <span className="eyebrow">LET'S BUILD TOGETHER</span>
          <h2>Have an Idea<br />Worth Building?</h2>
          <p>Tell us the problem. We&apos;ll help turn it into something real.</p>
          <div className="connect-buttons">
            <a className="button button-primary" href="mailto:theinnovibe@gmail.com">Start a Project <span aria-hidden="true">&rarr;</span></a>
            <a className="button button-secondary" href="mailto:theinnovibe@gmail.com">Let's Talk</a>
          </div>
        </div>
        
        <div className="connect-right">
           <ul className="connect-words">
             <li>IDEAS</li>
             <li>TECHNOLOGY</li>
             <li>PEOPLE</li>
             <li>SOLUTIONS</li>
             <li className="highlight">A BRIGHTER<br/>TOMORROW</li>
           </ul>
        </div>
      </Reveal>
    </section>
  );
}
