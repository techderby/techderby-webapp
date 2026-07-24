import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import { AuthProvider } from './contexts/AuthContext';
import { ConsentProvider } from './contexts/ConsentContext';
import { CookieConsentManager } from './components/CookieConsentManager';

export default function App() {
  return (
    <ConsentProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <CookieConsentManager />
    </ConsentProvider>
  );
}
