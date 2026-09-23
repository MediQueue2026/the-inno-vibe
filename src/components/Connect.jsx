import { Reveal } from '../hooks/useReveal.jsx';

export default function Connect() {
  return (
    <section className="connect section-wrap" id="connect">
      <Reveal className="connect-panel">
        <div className="connect-copy">
          <span className="eyebrow"><span className="status-dot"></span> LET’S TALK TECHNOLOGY</span>
          <h2>Big ideas. <span className="gradient-text">Real possibilities.</span></h2>
          <p>Have a product idea or a question about our projects? Let’s start a conversation.</p>
        </div>
        <div className="connect-actions">
          <a className="button button-primary" href="mailto:theinnovibe@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
          <a className="contact-email" href="mailto:theinnovibe@gmail.com">theinnovibe@gmail.com</a>
        </div>
      </Reveal>
    </section>
  );
}
