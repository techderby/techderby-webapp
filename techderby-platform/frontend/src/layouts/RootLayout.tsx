import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

/** Root layout that provides AuthContext to all routes */
export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
