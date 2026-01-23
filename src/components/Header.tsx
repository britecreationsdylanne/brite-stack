import type { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-end px-6 sm:px-8 md:px-10 lg:px-12 py-5">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#272D3F]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#272D3F]" />
          )}
          <span className="text-sm text-[#272D3F] hidden md:block font-medium">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#272D3F] rounded-xl hover:bg-[#1a1f2e] transition-all font-medium hover:-translate-y-0.5"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
