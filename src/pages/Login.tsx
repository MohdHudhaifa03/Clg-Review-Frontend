import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { GraduationCap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/images/college-1.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-0"></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">EduReview</span>
        </div>
        
        <div className="relative z-10 max-w-md animate-scale-in">
          <h2 className="text-4xl font-bold leading-tight tracking-tight mb-6">
            Discover the best colleges in the country.
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Join thousands of students sharing their honest reviews and experiences to help you make the right choice.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 animate-scale-in">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                <GraduationCap size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div className="animate-scale-in">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-foreground">Password</label>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white"
              />
            </div>

            <Button type="submit" className="w-full py-4 px-12 py-4 mx-auto w-60 py-4 text-base mt-6" loading={loading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100 text-xs text-indigo-600/80 text-center">
            <p className="font-medium mb-1 text-indigo-700">Demo Credentials</p>
            <p>Admin: admin@example.com</p>
            <p>Student: student@example.com</p>
            <p>Teacher: teacher@example.com</p>
            <p className="mt-1 font-medium">Password: Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
