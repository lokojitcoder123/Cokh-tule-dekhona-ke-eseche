const API_BASE = import.meta.env.VITE_API_URL || '/api';

/** Get the correct WebSocket URL based on the API base */
export function getWebSocketUrl(conversationId) {
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    const backendHost = API_BASE.replace(/^https?:\/\//, '').replace(/\/api$/, '');
    const protocol = API_BASE.startsWith('https://') ? 'wss:' : 'ws:';
    return `${protocol}//${backendHost}/ws/conversations/${conversationId}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/conversations/${conversationId}`;
}

/** Get stored auth token */
function getToken() {
  return localStorage.getItem('bengali_shadi_token');
}

/** Base fetch wrapper with token injection and error handling */
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('OFFLINE');
    }
    throw err;
  }
}

// --- Auth ---
export async function signup(name, email, password, gender) {
  const data = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, gender }),
  });
  localStorage.setItem('bengali_shadi_token', data.token);
  localStorage.setItem('bengali_shadi_profile_id', data.profileId);
  localStorage.setItem('bengali_shadi_name', data.name);
  return data;
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('bengali_shadi_token', data.token);
  localStorage.setItem('bengali_shadi_profile_id', data.profileId);
  localStorage.setItem('bengali_shadi_name', data.name);
  return data;
}

export function logout() {
  localStorage.removeItem('bengali_shadi_token');
  localStorage.removeItem('bengali_shadi_profile_id');
  localStorage.removeItem('bengali_shadi_name');
}

export function getAuth() {
  return {
    token: localStorage.getItem('bengali_shadi_token'),
    profileId: localStorage.getItem('bengali_shadi_profile_id'),
    name: localStorage.getItem('bengali_shadi_name'),
    isLoggedIn: !!localStorage.getItem('bengali_shadi_token'),
  };
}

// --- Profiles ---
export function getProfiles(gender) {
  const query = gender ? `?gender=${gender}` : '';
  return apiFetch(`/profiles${query}`);
}

export function getProfile(id) {
  return apiFetch(`/profiles/${id}`);
}

export function updateProfile(profile) {
  return apiFetch('/profiles', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

// --- Matches ---
export function getMatches(profileId) {
  return apiFetch(`/matches?profileId=${profileId}`);
}

export function generateMatchReport(profileOneId, profileTwoId) {
  return apiFetch('/match-reports', {
    method: 'POST',
    body: JSON.stringify({ profileOneId, profileTwoId }),
  });
}

// --- AI Advisor ---
export function aiChat(profileOneId, profileTwoId, message) {
  return apiFetch('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ profileOneId, profileTwoId, message }),
  });
}

// --- Interest Requests ---
export function getInterestRequests(profileId) {
  return apiFetch(`/interest-requests?profileId=${profileId}&box=all`);
}

export function sendInterest(senderId, receiverId) {
  return apiFetch('/interest-requests', {
    method: 'POST',
    body: JSON.stringify({ senderId, receiverId }),
  });
}

export function acceptInterest(id) {
  return apiFetch(`/interest-requests/${id}/accept`, { method: 'POST' });
}

export function declineInterest(id) {
  return apiFetch(`/interest-requests/${id}/decline`, { method: 'POST' });
}

// --- Conversations ---
export function getConversations(profileId) {
  return apiFetch(`/conversations?profileId=${profileId}`);
}

export function getMessages(conversationId, profileId) {
  return apiFetch(`/conversations/${conversationId}/messages?profileId=${profileId}`);
}

export function sendMessage(conversationId, senderId, content) {
  return apiFetch(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ senderId, content }),
  });
}
