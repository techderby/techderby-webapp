import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { AnalyticsPageView } from '../components/AnalyticsPageView';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <AnalyticsPageView />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
