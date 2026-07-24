import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  createConsentPreferences,
  readConsentPreferences,
  removeAnalyticsCookies,
  writeConsentPreferences,
  type ConsentPreferences,
} from '../lib/cookie-consent';
import { updateGoogleAnalyticsConsent } from '../lib/analytics';

type ConsentContextValue = {
  preferences: ConsentPreferences | null;
  analyticsEnabled: boolean;
  preferencesOpen: boolean;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(() => readConsentPreferences());
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    updateGoogleAnalyticsConsent(preferences?.analytics === true);
  }, [preferences?.analytics]);

  const savePreferences = useCallback((analytics: boolean) => {
    const next = createConsentPreferences(analytics);
    writeConsentPreferences(next);
    updateGoogleAnalyticsConsent(analytics);
    if (!analytics) removeAnalyticsCookies();
    setPreferences(next);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    preferences,
    analyticsEnabled: preferences?.analytics === true,
    preferencesOpen,
    acceptAnalytics: () => savePreferences(true),
    rejectAnalytics: () => savePreferences(false),
    savePreferences,
    openPreferences: () => setPreferencesOpen(true),
    closePreferences: () => setPreferencesOpen(false),
  }), [preferences, preferencesOpen, savePreferences]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
}
