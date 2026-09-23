import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <PageHero eyebrow="404" title={<>This page doesn’t exist<span className="cyan">.</span></>}>
      The link may be old or mistyped. <Link className="text-link inline-link" to="/">Back to the homepage <span aria-hidden="true">→</span></Link>
    </PageHero>
  );
}
