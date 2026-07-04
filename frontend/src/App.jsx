import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth } from './api/client';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import MatchListPage from './pages/MatchListPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import RequestCenterPage from './pages/RequestCenterPage';
import ConversationPage from './pages/ConversationPage';
import EditProfilePage from './pages/EditProfilePage';

export default function App() {
  const [auth, setAuth] = useState(getAuth());

  const refreshAuth = () => setAuth(getAuth());

  if (!auth.isLoggedIn) {
    return (
      <BrowserRouter>
        <LoginPage onLogin={refreshAuth} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Navbar auth={auth} onLogout={() => { 
        import('./api/client').then(m => { m.logout(); refreshAuth(); }); 
      }} />
      <main className="page">
        <div className="container">
          <Routes>
            <Route path="/" element={<MatchListPage profileId={auth.profileId} />} />
            <Route path="/matches" element={<MatchListPage profileId={auth.profileId} />} />
            <Route path="/profile/:id" element={<ProfileDetailPage myProfileId={auth.profileId} />} />
            <Route path="/ai-advisor/:profileTwoId" element={<AiAdvisorPage myProfileId={auth.profileId} />} />
            <Route path="/requests" element={<RequestCenterPage profileId={auth.profileId} />} />
            <Route path="/conversations" element={<ConversationPage profileId={auth.profileId} />} />
            <Route path="/conversations/:id" element={<ConversationPage profileId={auth.profileId} />} />
            <Route path="/edit-profile" element={<EditProfilePage profileId={auth.profileId} onProfileUpdate={refreshAuth} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
