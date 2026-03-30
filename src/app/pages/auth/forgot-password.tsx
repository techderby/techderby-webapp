import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check Your Email
        </h1>
        <p className="text-gray-600 mb-8">
          We've sent password reset instructions to {email}
        </p>
        <Link to="/login">
          <Button variant="outline">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600">
          Enter your email and we'll send you reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center">
        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
