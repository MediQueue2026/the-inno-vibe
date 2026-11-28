import { usePageTitle } from '../hooks/usePageTitle.js';
import Hero from '../components/Hero.jsx';
import CinematicStory from '../components/CinematicStory.jsx';
import Services from '../components/Services.jsx';
import Approach from '../components/Approach.jsx';
import SelectedWork from '../components/SelectedWork.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { testimonials } from '../testimonials.js';
import WhyTheInnoVibe from '../components/WhyTheInnoVibe.jsx';
import Connect from '../components/Connect.jsx';

// Section numbers follow whichever sections are shown.
const sections = ['services', 'work', ...(testimonials.length ? ['proof'] : []), 'approach', 'why'];
const numberOf = id => String(sections.indexOf(id) + 1).padStart(2, '0');

export default function Home() {
  usePageTitle();
  return (
    <div className="cosmic-home">
      <Hero />
      <CinematicStory />
      <Services number={numberOf('services')} band showModels />
      <SelectedWork number={numberOf('work')} />
      {/* Real client quotes only (testimonials.js). Without them this section would just
          repeat the project builds already shown in Selected work, so it stays hidden. */}
      {testimonials.length > 0 && <Testimonials number={numberOf('proof')} />}
      <Approach number={numberOf('approach')} />
      <WhyTheInnoVibe number={numberOf('why')} />
      <Connect />
    </div>
  );
}
