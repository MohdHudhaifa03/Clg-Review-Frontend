import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const { user } = useAuth();
  
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-white/50 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden flex shrink-0 h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-border/40 pl-4 sm:pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground hidden sm:inline">{user.name}</span>
              <span className="text-xs font-medium text-primary">{user.role}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <User size={20} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
