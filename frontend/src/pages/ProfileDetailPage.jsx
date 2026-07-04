import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile, generateMatchReport, sendInterest } from '../api/client';

export default function ProfileDetailPage({ myProfileId }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadProfile(); }, [id]);

  const loadProfile = async () => {
    try {
      const data = await getProfile(id);
      setProfile(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const data = await generateMatchReport(Number(myProfileId), Number(id));
      setReport(data);
    } catch (err) { console.error(err); }
    finally { setReportLoading(false); }
  };

  const handleSendInterest = async () => {
    try {
      await sendInterest(Number(myProfileId), Number(id));
      setInterestSent(true);
      setMessage('Interest sent! 💌');
    } catch (err) { setMessage(err.message); }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('') : '?';

  if (loading) return <div className="spinner"></div>;
  if (!profile) return <p className="text-center text-muted" style={{ padding: '4rem 0' }}>Profile not found.</p>;

  const p = profile;

  return (
    <div className="fade-in">
      {/* Profile Header Block */}
      <div className="card card-gold" style={{
        marginBottom: 'var(--space-6)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '2rem',
        alignItems: 'center',
        padding: '2.5rem',
      }}>
        {p.profilePicture ? (
          <img src={p.profilePicture} alt={p.name} className="profile-photo profile-photo-lg" style={{
            width: '140px',
            height: '140px',
            objectFit: 'cover',
            border: '3px solid var(--color-gold)',
            boxShadow: 'var(--shadow-gold)',
          }} />
        ) : (
          <div className="profile-photo profile-photo-lg" style={{
            width: '140px',
            height: '140px',
            fontSize: '3rem',
            background: 'linear-gradient(135deg, rgba(125, 34, 54, 0.3) 0%, rgba(215, 180, 106, 0.15) 100%)',
            color: 'var(--color-gold)',
          }}>{getInitials(p.name)}</div>
        )}

        <div>
          <h1 style={{ marginBottom: 'var(--space-1)', fontFamily: 'var(--font-headline)' }}>{p.name}</h1>
          <p style={{ color: 'var(--color-gold-2)', marginBottom: 'var(--space-3)', fontSize: '1.1rem', fontWeight: 600 }}>
            {p.age} years • {p.district}, {p.state} • {p.profession}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {p.religion && <span className="badge badge-gold">{p.religion}</span>}
            {p.subCommunity && <span className="badge badge-gold">{p.subCommunity}</span>}
            {p.regionOfOrigin && <span className="badge badge-crimson">{p.regionOfOrigin}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Number(p.id) === Number(myProfileId) ? (
            <Link to="/edit-profile" className="btn btn-primary">
              👤 Edit Profile
            </Link>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleSendInterest} disabled={interestSent}>
                {interestSent ? '✓ Interest Sent' : '💌 Send Interest'}
              </button>
              <Link to={`/ai-advisor/${p.id}`} className="btn btn-gold btn-sm">🪔 Ask AI Advisor</Link>
            </>
          )}
        </div>
      </div>

      {message && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(13, 111, 92, 0.2)',
          border: '1px solid var(--color-emerald-light)',
          color: 'var(--color-ivory)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          marginBottom: 'var(--space-4)',
          textAlign: 'center',
        }}>
          {message}
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        <DetailCard title="About Me" icon="📝" content={p.about} />
        <DetailCard title="Education & Career" icon="🎓" content={
          `${p.education || '—'} • ${p.profession || '—'} • ${p.income || '—'}`
        } />
        <DetailCard title="Family & Values" icon="🏠" content={
          `Family: ${p.familyType || '—'} (${p.familyValues || '—'}) • Children: ${p.childrenPlans || '—'} • Relocate: ${p.relocationWillingness || '—'}`
        } />
        <DetailCard title="Lifestyle" icon="🍽️" content={
          `Diet: ${p.diet || '—'} • Smoking: ${p.smoking || '—'} • Drinking: ${p.drinking || '—'}`
        } />
        <DetailCard title="Languages" icon="🗣️" content={
          `Mother tongue: ${p.motherTongue || 'Bengali'} • English: ${p.englishFluency || '—'} • Hindi: ${p.hindiFluency || '—'}`
        } />
        <DetailCard title="Interests & Goals" icon="✨" content={
          `${p.interests || '—'}\n\nLife goals: ${p.lifeGoals || '—'}`
        } />
      </div>

      {/* Generate Compatibility Report Block */}
      {Number(p.id) !== Number(myProfileId) && !report && (
        <div className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="ornamental-divider"><span className="ornament">✦</span></div>
          <button className="btn btn-gold btn-lg" onClick={handleGenerateReport} disabled={reportLoading}>
            {reportLoading ? 'Generating Report...' : '📊 Generate Compatibility Report'}
          </button>
        </div>
      )}

      {/* Compatibility Report Block */}
      {Number(p.id) !== Number(myProfileId) && report && (
        <div className="fade-in" style={{
          background: 'rgba(22, 18, 18, 0.6)',
          border: '1px solid rgba(255, 253, 247, 0.08)',
          borderRadius: '12px',
          padding: '2.5rem',
          marginBottom: 'var(--space-8)',
          backdropFilter: 'blur(10px)',
        }}>
          <div className="ornamental-divider" style={{ marginTop: 0 }}><span className="ornament">✦</span></div>
          <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-headline)', textAlign: 'center' }}>Compatibility Report</h2>
          
          <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', background: 'rgba(13, 11, 11, 0.6)', border: 'var(--border-gold)' }}>
            <div className="score-circle score-circle-lg" style={{
              margin: '0 auto var(--space-4)',
              background: 'linear-gradient(135deg, var(--color-emerald-light), var(--color-emerald))',
              boxShadow: '0 4px 20px rgba(38, 160, 131, 0.25)',
              color: 'var(--color-ivory)',
            }}>
              {report.overallScore}%
            </div>
            <h3 style={{ color: 'var(--color-gold-2)', marginBottom: 'var(--space-2)' }}>
              {report.recommendation}
            </h3>
            <p style={{ color: 'var(--color-mist)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              {report.summary}
            </p>
          </div>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Strengths */}
            <div className="card" style={{ borderLeft: '3px solid var(--color-emerald-light)' }}>
              <h4 style={{ color: 'var(--color-emerald-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                ✓ Strong Alignment Areas
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {report.strengths?.map((s, i) => (
                  <li key={i} style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--color-mist)' }}>
                    • {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns */}
            <div className="card" style={{ borderLeft: '3px solid var(--color-wine-light)' }}>
              <h4 style={{ color: 'var(--color-wine-light)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                ⚠ Points of Discussion
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {report.concerns?.length > 0 ? report.concerns.map((c, i) => (
                  <li key={i} style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--color-mist)' }}>
                    • {c}
                  </li>
                )) : <li style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>No major lifestyle differences identified.</li>}
              </ul>
            </div>
          </div>

          {/* Questions to Ask */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-gold-2)', fontSize: '1.1rem' }}>
              🗣 suggested Topics to Break the Ice
            </h4>
            <ul style={{ listStyle: 'none' }}>
              {report.questionsToAsk?.map((q, i) => (
                <li key={i} style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--color-mist)' }}>
                  {i + 1}. {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Score Breakdown Metrics Panel */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>📊 Compatibility Dimension Breakdown</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <ScoreBar label="Location" score={report.locationScore} />
              <ScoreBar label="Religion" score={report.religionScore} />
              <ScoreBar label="Lifestyle" score={report.lifestyleScore} />
              <ScoreBar label="Family" score={report.familyScore} />
              <ScoreBar label="Career" score={report.careerScore} />
              <ScoreBar label="Communication" score={report.communicationScore} />
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5 }}>
            {report.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailCard({ title, icon, content }) {
  return (
    <div className="card">
      <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-2)', fontSize: '1.1rem' }}>
        <span>{icon}</span> {title}
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-mist)', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.6 }}>
        {content || '—'}
      </p>
    </div>
  );
}

function ScoreBar({ label, score }) {
  return (
    <div style={{ background: 'var(--color-night-3)', padding: '1rem', borderRadius: '8px', border: 'var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-mist)' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold)' }}>{score}%</span>
      </div>
      <div style={{ height: '5px', background: 'var(--color-night)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: score >= 70 ? 'var(--color-emerald-light)' : score >= 40 ? 'var(--color-gold)' : 'var(--color-wine-light)',
          borderRadius: '999px',
          transition: 'width 0.8s ease',
        }}></div>
      </div>
    </div>
  );
}
