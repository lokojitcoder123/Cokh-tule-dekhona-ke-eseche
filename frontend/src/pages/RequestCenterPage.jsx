import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInterestRequests, acceptInterest, declineInterest } from '../api/client';

export default function RequestCenterPage({ profileId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => { loadRequests(); }, [profileId]);

  // Poll every 15 seconds
  useEffect(() => {
    const interval = setInterval(loadRequests, 15000);
    return () => clearInterval(interval);
  }, [profileId]);

  const loadRequests = async () => {
    try {
      const data = await getInterestRequests(profileId);
      setRequests(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAccept = async (id) => {
    try {
      const res = await acceptInterest(id);
      setActionMessage(res.message || 'Accepted!');
      loadRequests();
    } catch (err) { setActionMessage(err.message); }
  };

  const handleDecline = async (id) => {
    try {
      await declineInterest(id);
      setActionMessage('Request declined.');
      loadRequests();
    } catch (err) { setActionMessage(err.message); }
  };

  const received = requests.filter(r => r.direction === 'received');
  const sent = requests.filter(r => r.direction === 'sent');
  const active = activeTab === 'received' ? received : sent;

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Interest Requests</h1>
        <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
          Conversations open only when interest is mutually accepted
        </p>
      </div>

      {actionMessage && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(13, 111, 92, 0.15)',
          border: '1px solid var(--color-emerald-light)',
          color: 'var(--color-ivory)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          marginBottom: 'var(--space-4)',
        }}>
          {actionMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}>
          Received ({received.length})
        </button>
        <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}>
          Sent ({sent.length})
        </button>
      </div>

      {/* Request Cards */}
      {active.length === 0 ? (
        <div className="text-center" style={{ padding: 'var(--space-12) 0' }}>
          <p style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>💌</p>
          <h3>No {activeTab} requests yet</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
            {activeTab === 'received'
              ? 'When someone expresses interest in you, it will appear here.'
              : 'Explore matches and send interest to someone special!'}
          </p>
          {activeTab === 'sent' && (
            <Link to="/matches" className="btn btn-primary">Explore Matches</Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {active.map((req) => {
            const other = req.otherProfile || {};
            const initials = other.name ? other.name.split(' ').map(n => n[0]).join('') : '?';

            return (
              <div key={req.id} className="card card-gold" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                background: 'rgba(22, 18, 18, 0.75)',
                border: 'var(--border-light)',
              }}>
                {other.profilePicture ? (
                  <img src={other.profilePicture} alt={other.name} className="profile-photo profile-photo-sm" style={{
                    objectFit: 'cover',
                    border: '1.5px solid var(--color-gold)',
                  }} />
                ) : (
                  <div className="profile-photo profile-photo-sm" style={{
                    background: 'var(--color-night-3)',
                    color: 'var(--color-gold)',
                    border: '1.5px solid var(--color-gold)',
                  }}>{initials}</div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <Link to={`/profile/${other.id}`} style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-ivory)',
                    }}>
                      {other.name || 'Unknown'}
                    </Link>
                    <span className={`badge ${
                      req.status === 'PENDING' ? 'badge-pending' :
                      req.status === 'ACCEPTED' ? 'badge-success' : 'badge-declined'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-mist)', margin: 0 }}>
                    {other.age ? `${other.age} yrs` : ''} {other.district ? `• ${other.district}` : ''} {other.religion ? `• ${other.religion}` : ''}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {req.direction === 'received' && req.status === 'PENDING' && (
                    <>
                      <button className="btn btn-gold btn-sm" onClick={() => handleAccept(req.id)}>
                        Accept Request
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDecline(req.id)}>
                        Decline
                      </button>
                    </>
                  )}
                  {req.status === 'ACCEPTED' && (
                    <Link to="/conversations" className="btn btn-primary btn-sm">
                      💬 Open Chat
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
