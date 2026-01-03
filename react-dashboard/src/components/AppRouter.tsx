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
import PlatformLearning from '@/territories/platform/LearningPage';
import PlatformPublicChallenges from '@/territories/platform/PlatformPublicChallenges.tsx';
import Profile from '@/territories/landing/Profile';
import Home2 from '@/territories/landing/Home2';
import CompetitionsPage from '@/territories/landing/CompetitionsPage';
import HomeLayout from './layouts/HomeLayout';
import CompetitionById from '@/territories/landing/CompetitionById';

function AppRouter() {
  return (
    <Router>
      <Routes>

        {/* Landing Pages */}
        <Route element={<HomeLayout />} >
          <Route path="/" element={<Home2 />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/competitions/:id" element={<CompetitionById />} />
        </Route>
        <Route path="/onboard" element={<Onboarding />} />

        {/* auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path='/auth/sign-in' element={<SignInPage />} />
        <Route path="/profile/:id" element={<Profile />} />
          <Route path='/auth/sign-up' element={<SignUpPage />} />
        </Route>

          {/* Platform Routes */}
          <Route element={<PlatformLayout />}>
            <Route path="/platform/" element={<PlatformHome />} />
            <Route path="/platform/learning" element={<PlatformLearning />} />
            <Route path="/platform/Challanges" element={<PlatformPublicChallenges />} />
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