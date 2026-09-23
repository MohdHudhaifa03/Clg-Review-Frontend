import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="animate-scale-in">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Profile</h1>
      <Card className="max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <span className="inline-flex items-center mt-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary capitalize">
              {user.role.toLowerCase()}
            </span>
          </div>
        </div>
        <dl className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd className="font-medium text-foreground capitalize">{user.role.toLowerCase()}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </dd>
            </div>
          </div>
        </dl>
      </Card>
    </div>
  );
}

