import { useState } from 'react';
import { login, signup } from '../api/client';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Female');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(name, email, password, gender);
      } else {
        await login(email, password);
      }
      onLogin();
    } catch (err) {
      setError(err.message === 'OFFLINE' 
        ? 'Server is offline. Please start the backend first.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      background: 'var(--color-bg)',
    }} className="login-page">
      {/* Left Visual Hero Panel */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        background: `linear-gradient(rgba(45, 27, 20, 0.25), rgba(45, 27, 20, 0.85)), url('/images/girl1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        borderRight: 'var(--border-gold)',
      }}>
        {/* Brand Lockup */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          width: 'fit-content',
          padding: '0.5rem 0.85rem',
          borderRadius: '8px',
          background: 'rgba(255, 248, 240, 0.9)',
          border: 'var(--border-gold)',
          backdropFilter: 'blur(10px)',
          fontWeight: 900,
        }}>
          <span style={{
            display: 'inline-grid',
            placeItems: 'center',
            width: '2.2rem',
            aspectRatio: 1,
            borderRadius: '6px',
            color: '#FFF',
            background: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 950,
          }}>🪔</span>
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-primary)', fontFamily: 'var(--font-headline)' }}>
            Bengali <span style={{ color: 'var(--color-secondary)' }}>Shadi</span>
          </span>
        </div>

        {/* Hero Bottom Content */}
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '3rem',
            lineHeight: 1.1,
            marginBottom: '1rem',
            fontFamily: 'var(--font-headline)',
            color: '#FFF',
            textShadow: '0 2px 8px rgba(45, 27, 20, 0.6)',
          }}>
            আপনার জীবনসঙ্গী খুঁজুন।
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-linen)',
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(45, 27, 20, 0.6)',
            marginBottom: '2rem',
          }}>
            Find your life partner within the Bengali community. A platform designed with the modern Bengali household in mind, balancing rich cultural values and smart AI match assessment.
          </p>

          {/* Proof Strip / Stats */}
          <div className="proof-strip" style={{ marginTop: '2rem', borderTopColor: 'rgba(255, 255, 255, 0.2)', borderBottomColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="proof-item">
              <strong style={{ color: 'var(--color-gold)' }}>4,500+</strong>
              <span style={{ color: '#FFF' }}>Verified Profiles</span>
            </div>
            <div className="proof-item" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <strong style={{ color: 'var(--color-gold)' }}>1,200+</strong>
              <span style={{ color: '#FFF' }}>Happy Matches</span>
            </div>
            <div className="proof-item">
              <strong style={{ color: 'var(--color-gold)' }}>98.6%</strong>
              <span style={{ color: '#FFF' }}>Trust Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(178, 34, 52, 0.04) 0%, transparent 100%), var(--color-bg-secondary)',
      }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', border: 'var(--border-gold)', background: '#FFF' }}>
          <h2 style={{
            fontFamily: 'var(--font-headline)',
            textAlign: 'center',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--text-2xl)',
          }}>
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-muted text-sm" style={{ marginBottom: 'var(--space-6)' }}>
            {isSignup ? 'Begin your journey to find your life partner' : 'Sign in to continue your search'}
          </p>

          {error && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'rgba(178, 34, 52, 0.08)',
              border: '1px solid var(--color-primary-light)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label>Full Name</label>
                  <input className="input" type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g., Ananya Chatterjee" required />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label>Gender</label>
                  <select className="select" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required />
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
              {loading ? 'Please wait...' : (isSignup ? 'Create Profile' : 'Log In')}
            </button>

            <p className="text-center text-sm" style={{ color: 'var(--color-cocoa)' }}>
              {isSignup ? 'Already have an account? ' : 'New to Bengali Shadi? '}
              <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-primary)', fontWeight: 700,
                  fontFamily: 'var(--font-label)',
                }}>
                {isSignup ? 'Log In' : 'Create Account'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
