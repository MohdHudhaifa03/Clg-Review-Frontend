import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, GraduationCap, MessageSquare, User, Settings, LogOut, Building } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Colleges', to: '/colleges', icon: GraduationCap },
  { name: 'Reviews', to: '/reviews', icon: MessageSquare },
  { name: 'Profile', to: '/profile', icon: User },
];

const adminItems = [
  { name: 'Admin Dashboard', to: '/admin', icon: Settings },
  { name: 'Manage Colleges', to: '/admin/colleges', icon: Building },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground transition-all duration-300">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 font-heading text-xl font-bold tracking-tight text-white shadow-sm">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap size={20} />
        </div>
        EduReview
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Main Menu
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
className={({ isActive }) =>
                `group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <div className="mt-8">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Administration
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/admin'}
className={({ isActive }) =>
                `group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-sidebar-border/20 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
