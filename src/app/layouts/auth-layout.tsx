import { Outlet, Link } from 'react-router';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <div className="w-32 h-8 bg-gray-900 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Tech Derby</span>
              </div>
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Centered Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 Tech Derby. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
