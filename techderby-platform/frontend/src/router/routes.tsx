import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';

const HomePage = lazy(() => import('../pages/HomePage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventRegistrationPage = lazy(() => import('../pages/EventRegistrationPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProgrammesPage = lazy(() => import('../pages/ProgrammesPage'));
const TechStarWomenPage = lazy(() => import('../pages/TechStarWomenPage'));
const TechDerbyAcceleratorPage = lazy(() => import('../pages/TechDerbyAcceleratorPage'));
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
const AdminPage = lazy(() => import('../pages/AdminPage'));

const withLazy = (element: ReactNode) => <Suspense fallback={<p className="p-6">Loading...</p>}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withLazy(<HomePage />) },
      { path: 'events', element: withLazy(<EventsPage />) },
      { path: 'events/browse', element: withLazy(<EventRegistrationPage />) },
      { path: 'events/:slug', element: withLazy(<EventDetailPage />) },
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
      { path: 'wire', element: withLazy(<InsightsPage />) },
      { path: 'wire/:slug', element: withLazy(<InsightDetailPage />) },
      { path: 'insights', element: <Navigate to="/wire" replace /> },
      { path: 'insights/:slug', element: <Navigate to="/wire" replace /> },
      { path: 'contact', element: withLazy(<ContactPage />) },
      { path: 'privacy-policy', element: withLazy(<PrivacyPolicyPage />) },
      { path: 'cookie-policy', element: withLazy(<CookiePolicyPage />) },
      { path: 'data-policy', element: withLazy(<DataPolicyPage />) },
      { path: 'code-of-conduct', element: withLazy(<CodeOfConductPage />) },
      { path: 'accessibility', element: withLazy(<AccessibilityPage />) },
      { path: 'safeguarding', element: withLazy(<SafeguardingPage />) },
      { path: 'directory', element: withLazy(<MemberDirectoryPage />) },
      { path: 'login', element: withLazy(<LoginPage />) },
      { path: 'admin', element: withLazy(<AdminPage />) },
    ],
  },
]);
