import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { aiChat, getProfile } from '../api/client';

export default function AiAdvisorPage({ myProfileId }) {
  const { profileTwoId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    getProfile(profileTwoId).then(p => setPartnerName(p.name)).catch(() => {});
    // Welcome message
    setMessages([{
      role: 'ai',
      content: `Namaskar! 🪔 I'm your Bengali Shadi marriage advisor. I have analyzed your compatibility report based on locations, values, and lifestyle dimensions. Ask me anything about how well you match with ${partnerName || 'your match'}, or seek advice on conversation starters!`,
    }]);
  }, [profileTwoId, partnerName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const data = await aiChat(Number(myProfileId), Number(profileTwoId), msg);
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, check the compatibility report for insights!",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What are our main strengths?",
    "Any concerns I should know about?",
    "What should we discuss first?",
    "How compatible are our lifestyles?",
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid rgba(255, 253, 247, 0.1)',
      }}>
        <div style={{
          width: '3.2rem',
          aspectRatio: 1,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, rgba(215, 180, 106, 0.2) 0%, rgba(125, 34, 54, 0.15) 100%)',
          border: '1px solid rgba(215, 180, 106, 0.3)',
          fontSize: '1.5rem',
        }}>🪔</div>
        <div>
          <h2 style={{ marginBottom: '0.2rem', fontFamily: 'var(--font-headline)' }}>AI Marriage Advisor</h2>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            Analyzing compatibility expectations and values with {partnerName || 'your match'}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        background: 'rgba(22, 18, 18, 0.7)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 253, 247, 0.08)',
        padding: '1.5rem',
        minHeight: '400px',
        maxHeight: '460px',
        overflowY: 'auto',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 'var(--space-4)',
            gap: '0.75rem',
          }}>
            {msg.role === 'ai' && (
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'rgba(215, 180, 106, 0.15)',
                border: '1px solid rgba(215, 180, 106, 0.25)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1rem',
                flexShrink: 0,
              }}>🪔</div>
            )}
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-sent' : 'chat-bubble-ai'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'rgba(215, 180, 106, 0.15)',
              border: '1px solid rgba(215, 180, 106, 0.25)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1rem',
              flexShrink: 0,
            }}>🪔</div>
            <div className="chat-bubble chat-bubble-ai" style={{ animation: 'pulse 1.5s infinite' }}>
              DeepSeek is analyzing your biodata alignment...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {suggestions.map((s, i) => (
            <button key={i} className="btn btn-outline btn-sm" onClick={() => handleSend(s)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '999px' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Group */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about compatibility or family values..." disabled={loading}
          style={{ background: 'var(--color-night-2)', border: '1px solid rgba(255, 253, 247, 0.1)' }} />
        <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          Ask Advisor
        </button>
      </div>
    </div>
  );
}
