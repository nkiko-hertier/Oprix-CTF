import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/territories/landing/Home';
import AuthLayout from './layouts/AuthLayout';
import SignInPage from '@/territories/auth/SignInPage';
import SignUpPage from '@/territories/auth/SignUpPage';
import Onboarding from '@/territories/landing/Onboarding';
import AdminLayout from './layouts/DashboardLayout';
import PlatformLayout from './layouts/PlatformLayout';
import PlatformHome from '@/territories/platform/Home';
import CompetitionPage from '@/territories/platform/CompetitionPage';
import SingleCompetitionsPage from '@/territories/platform/SingleCompetitionsPage';
import UserProfile from '@/territories/platform/UserProfile';
import SubmissionsHistory from '@/territories/platform/SubmissionsHistory';
import NotFound from '@/territories/landing/NotFound';
import Dashboard from '@/territories/admin/Dashboard';
import CompetitionManagement from '@/territories/admin/CompetitionManagement';
import ChallengeManagement from '@/territories/admin/ChallengeManagement';
import PlayerManagement from '@/territories/admin/PlayerManagement';
import SubmissionReview from '@/territories/admin/SubmissionReview';
import PlatformLearning from '@/territories/platform/LearningPage';
import Profile from '@/territories/landing/Profile';

function AppRouter() {
  return (
    <Router>
      <Routes>

        {/* Landing Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/onboard" element={<Onboarding />} />

        {/* auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path='/auth/sign-in' element={<SignInPage />} />
        <Route path="/profile/:id" element={<Profile />} />
          <Route path='/auth/sign-up' element={<SignUpPage />} />
        </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/competitions" element={<CompetitionManagement />} />
            <Route path="/dashboard/challenges/:competitionId" element={<ChallengeManagement />} />
            <Route path="/dashboard/users" element={<PlayerManagement />} />
            <Route path="/dashboard/submissions" element={<SubmissionReview />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>

          {/* Platform Routes */}
          <Route element={<PlatformLayout />}>
            <Route path="/platform/" element={<PlatformHome />} />
            <Route path="/platform/learning" element={<PlatformLearning />} />
            <Route path="/platform/competition" element={<CompetitionPage />} />
            <Route path="/platform/competition/:id" element={<SingleCompetitionsPage />} />
            <Route path="/platform/profile" element={<UserProfile />} />
            <Route path="/platform/submissions" element={<SubmissionsHistory />} />
            <Route path="/platform/*" element={<div>Platform - To be implemented</div>} />
          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRouter