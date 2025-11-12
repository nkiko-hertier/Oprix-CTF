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
          <Route path='/auth/sign-up' element={<SignUpPage />} />
        </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard/*" element={<div>Admin Panel - To be implemented</div>} />
          </Route>

          {/* Platform Routes */}
          <Route element={<PlatformLayout />}>
            <Route path="/platform/" element={<PlatformHome />} />
            <Route path="/platform/learning" element={<PlatformHome />} />
            <Route path="/platform/competition" element={<CompetitionPage />} />
            <Route path="/platform/competition/:id" element={<SingleCompetitionsPage />} />
            <Route path="/platform/*" element={<div>Platform - To be implemented</div>} />
          </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter