import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { GraduationCap } from 'lucide-react';
import type { UserRole } from '../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row-reverse bg-slate-50">
      {/* Right side - Decorative (Reversed for Register page) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/images/college-1.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay transform -scale-x-100"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-0"></div>
        
        <div className="relative z-10 flex items-center justify-end gap-2">
          <span className="text-xl font-bold tracking-tight">EduReview</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
            <GraduationCap size={24} />
          </div>
        </div>
        
        <div className="relative z-10 max-w-md animate-scale-in self-end text-right">
          <h2 className="text-4xl font-bold leading-tight tracking-tight mb-6">
            Start your journey today.
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Create an account to rate colleges, share your experiences, and help thousands of students make informed decisions.
          </p>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 animate-scale-in">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                <GraduationCap size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join the College Review System today.
            </p>
          </div>

          {error && (
            <div className="animate-scale-in">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input 
                  label="Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe"
                  required 
                  className="bg-white"
                />
              </div>
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <Input
                  label="Password"
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  label="I am a..."
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  options={[
                    { label: 'Student', value: 'STUDENT' },
                    { label: 'Teacher', value: 'TEACHER' },
                    { label: 'Administrator', value: 'ADMIN' },
                  ]}
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-base mt-4" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
