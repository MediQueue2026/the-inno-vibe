import { useOutletContext } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import Hero from '../components/Hero.jsx';
import CinematicStory from '../components/CinematicStory.jsx';
import Services from '../components/Services.jsx';
import Approach from '../components/Approach.jsx';
import SelectedWork from '../components/SelectedWork.jsx';
import WhyTheInnoVibe from '../components/WhyTheInnoVibe.jsx';

export default function Home() {
  const { toggleMotion } = useOutletContext();
  usePageTitle();
  return (
    <div className="cosmic-home">
      <Hero onToggleMotion={toggleMotion} />
      <CinematicStory />
      <Services number="01" band />
      <SelectedWork />
      <Approach number="03" />
      <WhyTheInnoVibe />
    </div>
  );
}
