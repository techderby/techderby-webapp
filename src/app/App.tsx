import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { PublicLayout } from './layouts/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout';
import { AuthLayout } from './layouts/auth-layout';

// Public Pages
import { HomePage } from './pages/public/home';
import { AboutPage } from './pages/public/about';
import { ProgrammesPage } from './pages/public/programmes';
import { MeetupsPage } from './pages/public/meetups';
import { SkillsPage } from './pages/public/skills';
import { InnovationPage } from './pages/public/innovation';
import { TechStarWomenPage } from './pages/public/tech-star-women';
import { ExpressPage } from './pages/public/express';
import { EventsListingPage } from './pages/public/events-listing';
import { EventDetailPage } from './pages/public/event-detail';
import { CommunityPage } from './pages/public/community';
import { PartnersPage } from './pages/public/partners';
import { GetInvolvedPage } from './pages/public/get-involved';
import { ContactPage } from './pages/public/contact';
import { InsightsPage } from './pages/public/insights';
import { PrivacyPage } from './pages/public/privacy';
import { TermsPage } from './pages/public/terms';
import { CodeOfConductPage } from './pages/public/code-of-conduct';
import { AccessibilityPage } from './pages/public/accessibility';
import { SafeguardingPage } from './pages/public/safeguarding';

// Auth Pages
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { ForgotPasswordPage } from './pages/auth/forgot-password';

// Member Pages
import { MemberDashboardPage } from './pages/member/dashboard';
import { MemberDirectoryPage } from './pages/member/directory';
import { MemberProfilePage } from './pages/member/profile';

// Partner Pages
import { PartnerDashboardPage } from './pages/partner/dashboard';
import { TalentRequestPage } from './pages/partner/talent-request';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/dashboard';
import { AdminEventsPage } from './pages/admin/events';
import { AdminEventEditPage } from './pages/admin/event-edit';
import { AdminMembersPage } from './pages/admin/members';
import { AdminContentPage } from './pages/admin/content';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route path="/programmes/meetups" element={<MeetupsPage />} />
          <Route path="/programmes/skills" element={<SkillsPage />} />
          <Route path="/programmes/innovation" element={<InnovationPage />} />
          <Route path="/programmes/tech-star-women" element={<TechStarWomenPage />} />
          <Route path="/programmes/express" element={<ExpressPage />} />
          <Route path="/events" element={<EventsListingPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/safeguarding" element={<SafeguardingPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Member Routes */}
        <Route path="/member" element={<DashboardLayout userType="member" />}>
          <Route index element={<Navigate to="/member/dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboardPage />} />
          <Route path="directory" element={<MemberDirectoryPage />} />
          <Route path="profile" element={<MemberProfilePage />} />
        </Route>

        {/* Partner Routes */}
        <Route path="/partner" element={<DashboardLayout userType="partner" />}>
          <Route index element={<Navigate to="/partner/dashboard" replace />} />
          <Route path="dashboard" element={<PartnerDashboardPage />} />
          <Route path="talent-request" element={<TalentRequestPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout userType="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="events/new" element={<AdminEventEditPage />} />
          <Route path="events/:id/edit" element={<AdminEventEditPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="content" element={<AdminContentPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}