import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';

const HomePage = lazy(() => import('../pages/HomePage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventRegistrationPage = lazy(() => import('../pages/EventRegistrationPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProgrammesPage = lazy(() => import('../pages/ProgrammesPage'));
const TechStarWomenPage = lazy(() => import('../pages/TechStarWomenPage'));
const TechDerbyAcceleratorPage = lazy(() => import('../pages/TechDerbyAcceleratorPage'));
const TechDerbySummitPage = lazy(() => import('../pages/TechDerbySummitPage'));
const AcceleratorApplicationPage = lazy(() => import('../pages/AcceleratorApplicationPage'));
const MembershipPage = lazy(() => import('../pages/MembershipPage'));
const GetInvolvedPage = lazy(() => import('../pages/GetInvolvedPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const PartnersPage = lazy(() => import('../pages/PartnersPage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const InsightDetailPage = lazy(() => import('../pages/InsightDetailPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('../pages/CookiePolicyPage'));
const DataPolicyPage = lazy(() => import('../pages/DataPolicyPage'));
const CodeOfConductPage = lazy(() => import('../pages/CodeOfConductPage'));
const AccessibilityPage = lazy(() => import('../pages/AccessibilityPage'));
const SafeguardingPage = lazy(() => import('../pages/SafeguardingPage'));
const MemberDirectoryPage = lazy(() => import('../pages/MemberDirectoryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const NewsletterComposerPage = lazy(() => import('../pages/NewsletterComposerPage'));
const EventAdminPage = lazy(() => import('../pages/dashboard/EventAdminPage'));
const WriterApplicationPage = lazy(() => import('../pages/dashboard/WriterApplicationPage'));
const ArticlesDashboardPage = lazy(() => import('../pages/dashboard/ArticlesDashboardPage'));
const ArticleEditorPage = lazy(() => import('../pages/dashboard/ArticleEditorPage'));
const EditorialAdminPage = lazy(() => import('../pages/dashboard/EditorialAdminPage'));
const WriterManagementPage = lazy(() => import('../pages/dashboard/WriterManagementPage'));

// Dashboard pages
const DashboardHomePage = lazy(() => import('../pages/dashboard/DashboardHomePage'));
const ProfilePage = lazy(() => import('../pages/dashboard/ProfilePage'));
const DirectoryPage = lazy(() => import('../pages/dashboard/DirectoryPage'));
const ConnectionsPage = lazy(() => import('../pages/dashboard/ConnectionsPage'));
const ChatPage = lazy(() => import('../pages/dashboard/ChatPage'));

const withLazy = (element: ReactNode) => <Suspense fallback={<p className="p-6">Loading...</p>}>{element}</Suspense>;

export const router = createBrowserRouter([
  // ── Standalone auth pages ──────────────────────────────────────────────────
  { path: '/login', element: withLazy(<LoginPage />) },
  { path: '/register', element: withLazy(<RegisterPage />) },
  { path: '/forgot-password', element: withLazy(<ForgotPasswordPage />) },
  { path: '/reset-password', element: withLazy(<ResetPasswordPage />) },

  // ── Dashboard (protected) ─────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withLazy(<DashboardHomePage />) },
      { path: 'profile', element: withLazy(<ProfilePage />) },
      { path: 'directory', element: withLazy(<DirectoryPage />) },
      { path: 'connections', element: withLazy(<ConnectionsPage />) },
      { path: 'messages', element: withLazy(<ChatPage />) },
      { path: 'messages/:userId', element: withLazy(<ChatPage />) },
      { path: 'writer-application', element: withLazy(<WriterApplicationPage />) },
      {
        path: 'articles',
        element: withLazy(
          <ProtectedRoute requiredRole="editor">
            <ArticlesDashboardPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'articles/new',
        element: withLazy(
          <ProtectedRoute requiredRole="editor">
            <ArticleEditorPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'articles/:documentId/edit',
        element: withLazy(
          <ProtectedRoute requiredRole="editor">
            <ArticleEditorPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'article-review',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <EditorialAdminPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'writers',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <WriterManagementPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'events',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <EventAdminPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'events/new',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <EventAdminPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'events/:documentId/edit',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <EventAdminPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'mailing-list',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>,
        ),
      },
      {
        path: 'mailing-list/compose',
        element: withLazy(
          <ProtectedRoute requiredRole="admin">
            <NewsletterComposerPage />
          </ProtectedRoute>,
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Public pages ───────────────────────────────────────────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withLazy(<HomePage />) },
      { path: 'events', element: withLazy(<EventsPage />) },
      { path: 'events/browse', element: withLazy(<EventRegistrationPage />) },
      { path: 'events/:slug', element: withLazy(<EventDetailPage />) },
      { path: 'summit-2026', element: withLazy(<TechDerbySummitPage />) },
      { path: 'about', element: withLazy(<AboutPage />) },
      { path: 'programmes', element: withLazy(<ProgrammesPage />) },
      { path: 'tech-derby-accelerator', element: withLazy(<TechDerbyAcceleratorPage />) },
      { path: 'programmes/pre-seed-accelerator', element: withLazy(<TechDerbyAcceleratorPage />) },
      { path: 'programmes/tech-star-women', element: withLazy(<TechStarWomenPage />) },
      { path: 'programmes/pre-seed-accelerator/apply', element: withLazy(<AcceleratorApplicationPage />) },
      { path: 'membership', element: withLazy(<MembershipPage />) },
      { path: 'get-involved', element: withLazy(<GetInvolvedPage />) },
      { path: 'community', element: withLazy(<CommunityPage />) },
      { path: 'partners', element: withLazy(<PartnersPage />) },
      { path: 'insights', element: withLazy(<InsightsPage />) },
      { path: 'insights/:slug', element: withLazy(<InsightDetailPage />) },
      { path: 'wire', element: withLazy(<InsightsPage />) },
      { path: 'wire/:slug', element: withLazy(<InsightDetailPage />) },
      { path: 'contact', element: withLazy(<ContactPage />) },
      { path: 'privacy-policy', element: withLazy(<PrivacyPolicyPage />) },
      { path: 'cookie-policy', element: withLazy(<CookiePolicyPage />) },
      { path: 'data-policy', element: withLazy(<DataPolicyPage />) },
      { path: 'code-of-conduct', element: withLazy(<CodeOfConductPage />) },
      { path: 'accessibility', element: withLazy(<AccessibilityPage />) },
      { path: 'safeguarding', element: withLazy(<SafeguardingPage />) },
      { path: 'directory', element: withLazy(<MemberDirectoryPage />) },
      { path: 'admin', element: <Navigate to="/dashboard/mailing-list" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
]);

