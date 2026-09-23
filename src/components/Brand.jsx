import { Link } from 'react-router';
import icon from '../assets/theinnovibe-icon.png';

export default function Brand({ size = 44, ...props }) {
  return (
    <Link className="brand" to="/" {...props}>
      <img src={icon} alt="" width={size} height={size} />
      <span>The<span className="brand-accent">Inno</span>Vibe<span className="brand-dot">.</span></span>
    </Link>
  );
}
