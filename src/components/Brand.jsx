import { Link } from 'react-router';
// A 96px copy (12KB) of the 600KB source; the mark never renders above 44px.
import icon from '../assets/theinnovibe-icon-96.png';

export default function Brand({ size = 44, ...props }) {
  return (
    <Link className="brand" to="/" {...props}>
      <img src={icon} alt="" width={size} height={size} />
      <span>The<span className="brand-accent">Inno</span>Vibe<span className="brand-dot">.</span></span>
    </Link>
  );
}
