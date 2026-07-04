import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ auth, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span style={{
            display: 'inline-grid',
            placeItems: 'center',
            width: '1.8rem',
            aspectRatio: 1,
            borderRadius: '4px',
            color: 'var(--color-night)',
            background: 'var(--color-gold)',
            fontSize: '0.75rem',
            fontWeight: 950,
            marginRight: '0.2rem'
          }}>🪔</span>
          Bengali <span className="logo-accent">Shadi</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/matches" className={isActive('/matches') || location.pathname === '/' ? 'active' : ''}>
              💑 Matches
            </Link>
          </li>
          <li>
            <Link to="/requests" className={isActive('/requests') ? 'active' : ''}>
              💌 Requests
            </Link>
          </li>
          <li>
            <Link to="/conversations" className={isActive('/conversations') ? 'active' : ''}>
              💬 Messages
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid rgba(255, 253, 247, 0.1)', paddingLeft: '1rem' }}>
            <Link to="/edit-profile" className={isActive('/edit-profile') ? 'active' : ''} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              👤 {auth.name || 'My Profile'}
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
