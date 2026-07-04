import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversations, getMessages, sendMessage, getWebSocketUrl } from '../api/client';

export default function ConversationPage({ profileId }) {
  const { id: selectedId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const wsRef = useRef(null);

  // Load conversations
  useEffect(() => { loadConversations(); }, [profileId]);

  // Poll conversations every 15 seconds
  useEffect(() => {
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [profileId]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      connectWebSocket(selectedId);
    }
    return () => { wsRef.current?.close(); };
  }, [selectedId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await getConversations(profileId);
      setConversations(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadMessages = async (convId) => {
    try {
      const data = await getMessages(convId, profileId);
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  const connectWebSocket = (convId) => {
    wsRef.current?.close();
    try {
      const wsUrl = getWebSocketUrl(convId);
      const ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        } catch (e) { console.error('WebSocket parse error', e); }
      };
      ws.onerror = () => console.warn('WebSocket error');
      wsRef.current = ws;
    } catch (e) { console.warn('WebSocket connect failed', e); }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedId || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    try {
      await sendMessage(selectedId, profileId, text);
      // Message will arrive via WebSocket, but also reload to be safe
      await loadMessages(selectedId);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const activeConv = conversations.find(c => String(c.id) === String(selectedId));

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', minHeight: '70vh' }}>
      {/* Left Sidebar: Conversation List */}
      <div style={{
        background: 'rgba(22, 18, 18, 0.75)',
        border: '1px solid rgba(255, 253, 247, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255, 253, 247, 0.1)', paddingBottom: '0.75rem', fontFamily: 'var(--font-headline)' }}>
          Conversations
        </h3>

        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <p style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>💬</p>
            <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>No conversations yet.</p>
            <p className="text-muted text-xs">Accept an interest request in the Request Center to start chatting!</p>
            <Link to="/requests" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
              View Requests
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '500px' }}>
            {conversations.map(conv => {
              const isActive = String(conv.id) === String(selectedId);
              const initials = conv.partnerName ? conv.partnerName.split(' ').map(n => n[0]).join('') : '?';
              return (
                <Link key={conv.id} to={`/conversations/${conv.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(215, 180, 106, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(215, 180, 106, 0.25)' : '1px solid transparent',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all var(--transition-fast)',
                  }}>
                  {conv.partnerProfilePicture ? (
                    <img src={conv.partnerProfilePicture} alt={conv.partnerName} className="profile-photo profile-photo-sm" style={{
                      objectFit: 'cover',
                      border: isActive ? '1.5px solid var(--color-gold)' : '1.5px solid transparent',
                    }} />
                  ) : (
                    <div className="profile-photo profile-photo-sm" style={{
                      background: 'var(--color-night-3)',
                      color: 'var(--color-gold)',
                    }}>{initials}</div>
                  )}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: 'var(--color-ivory)' }}>
                      {conv.partnerName || 'Unknown'}
                    </p>
                    {conv.lastMessage && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-mist)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}>
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Chat Window */}
      <div style={{
        background: 'rgba(22, 18, 18, 0.75)',
        border: '1px solid rgba(255, 253, 247, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '500px',
      }}>
        {!selectedId ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-muted)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</p>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-ivory)' }}>Your Mailbox</h3>
              <p className="text-muted text-sm">Select a contact from the sidebar to chat live</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 253, 247, 0.1)',
              marginBottom: '1rem',
            }}>
              {activeConv?.partnerProfilePicture ? (
                <img src={activeConv.partnerProfilePicture} alt={activeConv.partnerName} className="profile-photo profile-photo-sm" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="profile-photo profile-photo-sm" style={{ background: 'var(--color-night-3)', color: 'var(--color-gold)' }}>
                  {activeConv?.partnerName?.split(' ').map(n => n[0]).join('') || '?'}
                </div>
              )}
              <div>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--color-ivory)', fontSize: '1.05rem' }}>{activeConv?.partnerName || 'Chat'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gold-2)', margin: 0, fontWeight: 600 }}>
                  {activeConv?.partnerDistrict ? `${activeConv.partnerDistrict} • ` : ''}{activeConv?.partnerReligion || ''}
                </p>
              </div>
              <Link to={`/profile/${activeConv?.partnerId}`} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                View Bio
              </Link>
            </div>

            {/* Message Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem 0',
              maxHeight: '340px',
              minHeight: '260px',
            }}>
              {messages.length === 0 ? (
                <p className="text-center text-muted text-sm" style={{ padding: '3rem 0' }}>
                  A safe, private connection has been established. Say hello! 🪔
                </p>
              ) : (
                messages.map((msg, i) => {
                  const isMine = String(msg.senderId) === String(profileId);
                  return (
                    <div key={msg.id || i} style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      marginBottom: '0.75rem',
                    }}>
                      <div className={`chat-bubble ${isMine ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                        {msg.content}
                        {msg.sentAt && (
                          <div className="chat-time" style={{ textAlign: isMine ? 'right' : 'left' }}>
                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Group */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 253, 247, 0.1)',
            }}>
              <input className="input" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Write a message..." disabled={sending}
                style={{ background: 'var(--color-night-2)', border: '1px solid rgba(255, 253, 247, 0.1)' }} />
              <button className="btn btn-primary" onClick={handleSend} disabled={sending || !input.trim()}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
