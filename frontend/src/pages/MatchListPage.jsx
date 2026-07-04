import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../api/client';
import demoProfiles from '../data/demoProfiles';

export default function MatchListPage({ profileId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [profileId]);

  const loadMatches = async () => {
    try {
      const data = await getMatches(profileId);
      setMatches(data);
      setOffline(false);
    } catch (err) {
      if (err.message === 'OFFLINE') {
        setOffline(true);
        // Fallback to demo data
        setMatches(demoProfiles.map(p => ({
          profile: p,
          compatibilityScore: Math.floor(Math.random() * 40) + 50,
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Your Matches</h1>
        <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
          Profiles ranked by compatibility — our scoring engine calculates compatibility based on lifestyle, values, and location
        </p>
      </div>

      {offline && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(215, 180, 106, 0.08)',
          borderRadius: 'var(--radius)',
          border: 'var(--border-gold)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gold)',
        }}>
          🪔 Offline Mode — serving seeded Bengali demo profiles
        </div>
      )}

      <div className="grid-3">
        {matches.map((match, i) => {
          const p = match.profile;
          const score = match.compatibilityScore;
          return (
            <div key={p.id || i} className="card card-gold" style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animationDelay: `${i * 0.05}s`,
            }}>
              {/* Photo Frame Container */}
              <div style={{
                height: '240px',
                position: 'relative',
                background: 'var(--color-night-3)',
                overflow: 'hidden',
              }}>
                {p.profilePicture ? (
                  <img src={p.profilePicture} alt={p.name} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'saturate(0.9) brightness(0.9)',
                    transition: 'transform 0.4s ease',
                  }} />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    color: 'var(--color-gold)',
                    background: 'linear-gradient(135deg, rgba(125, 34, 54, 0.2), rgba(215, 180, 106, 0.1))',
                  }}>
                    {getInitials(p.name)}
                  </div>
                )}
                
                {/* Compatibility Score Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, var(--color-wine) 0%, rgba(125, 34, 54, 0.95) 100%)',
                  border: '1px solid rgba(255, 253, 247, 0.15)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-ivory)',
                  boxShadow: 'var(--shadow)',
                }}>
                  {score}% Match
                </div>

                {/* Info gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(13, 11, 11, 0.95), transparent)',
                }}></div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontFamily: 'var(--font-headline)' }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gold-2)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {p.age} yrs • {p.district}, {p.state}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {p.religion && <span className="badge badge-gold">{p.religion}</span>}
                    {p.profession && <span className="badge badge-crimson">{p.profession}</span>}
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-mist)',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.about || 'Looking for a warm and respectful relationship.'}
                  </p>
                </div>

                <Link to={`/profile/${p.id}`} className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                  View Profile
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {matches.length === 0 && (
        <div className="text-center" style={{ padding: 'var(--space-16) 0' }}>
          <p style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>🪔</p>
          <h3>No matches found yet</h3>
          <p className="text-muted">Complete your profile to start seeing matches</p>
        </div>
      )}
    </div>
  );
}
