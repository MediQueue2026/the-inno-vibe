import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <PageHero
      eyebrow="404 / NOT FOUND"
      title={<>This page doesn’t exist<span className="cyan">.</span></>}
      actions={<>
        <Link className="button button-primary" to="/">Back to homepage <span aria-hidden="true">→</span></Link>
        <Link className="button button-secondary" to="/domains">Explore our systems</Link>
      </>}
    >
      The link you followed may be outdated or mistyped. Let’s get you back to familiar ground.
    </PageHero>
  );
}
