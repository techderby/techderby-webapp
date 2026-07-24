import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../contexts/ConsentContext';
import { trackPageView } from '../lib/analytics';

const EXCLUDED_PATHS = new Set(['/unsubscribe']);

export function AnalyticsPageView() {
  const location = useLocation();
  const { analyticsEnabled } = useConsent();

  useEffect(() => {
    if (!analyticsEnabled || EXCLUDED_PATHS.has(location.pathname)) return;
    const timer = window.setTimeout(() => {
      trackPageView(location.pathname, document.title, location.key);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [analyticsEnabled, location.key, location.pathname]);

  return null;
}
