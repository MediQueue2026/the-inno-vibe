import { useOutletContext } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Services from '../components/Services.jsx';
import Approach from '../components/Approach.jsx';

export default function Home() {
  const { toggleMotion } = useOutletContext();
  usePageTitle();
  return (
    <>
      <Hero onToggleMotion={toggleMotion} />
      <About />
      <Services number="02" band />
      <Approach />
    </>
  );
}
