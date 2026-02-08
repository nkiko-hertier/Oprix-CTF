import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Competitions } from './pages/Competitions';
import { CompetitionDetail } from './pages/CompetitionDetail';
import { Leaderboard } from './pages/Leaderboard';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { MyCompetitions } from './pages/MyCompetitions';
import { CompetitionHub } from './pages/CompetitionHub';
import { Challenges } from './pages/Challenges';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { TeamManagement } from './pages/TeamManagement';
import { Submissions } from './pages/Submissions';
import { Notifications } from './pages/Notifications';
import { Certificates } from './pages/Certificates';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:id" element={<CompetitionDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/certificates/verify" element={<VerifyCertificate />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/competitions" element={<MyCompetitions />} />
        <Route path="/app/competitions/:id" element={<CompetitionHub />} />
        <Route path="/app/competitions/:id/challenges" element={<Challenges />} />
        <Route path="/app/competitions/:id/challenges/:challengeId" element={<ChallengeDetail />} />
        <Route path="/app/competitions/:id/team" element={<TeamManagement />} />
        <Route path="/app/submissions" element={<Submissions />} />
        <Route path="/app/notifications" element={<Notifications />} />
        <Route path="/app/leaderboard" element={<Leaderboard />} />
        <Route path="/app/certificates" element={<Certificates />} />
        <Route path="/app/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
