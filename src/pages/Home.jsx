import { usePageTitle } from '../hooks/usePageTitle.js';
import Hero from '../components/Hero.jsx';
import CinematicStory from '../components/CinematicStory.jsx';
import Services from '../components/Services.jsx';
import Approach from '../components/Approach.jsx';
import SelectedWork from '../components/SelectedWork.jsx';
import WhyTheInnoVibe from '../components/WhyTheInnoVibe.jsx';
import Connect from '../components/Connect.jsx';

export default function Home() {
  usePageTitle();
  return (
    <div className="cosmic-home">
      <Hero />
      <CinematicStory />
      <Services number="01" band showModels />
      <SelectedWork />
      <Approach number="03" />
      <WhyTheInnoVibe />
      <Connect />
    </div>
  );
}
