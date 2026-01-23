import type { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#272D3F]">
      <div className="flex items-center gap-3">
        {/* BriteCo Diamond Logo */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10L85 45L50 90L15 45L50 10Z"
            fill="#31D7CA"
            stroke="#31D7CA"
            strokeWidth="2"
          />
          <path
            d="M50 10L85 45L50 50L15 45L50 10Z"
            fill="#008182"
          />
        </svg>
        <div>
          <h1 className="text-xl font-semibold text-white">
            <span className="text-white">brite</span>
            <span className="text-[#A9C1CB]">co</span>
          </h1>
          <p className="text-xs text-[#31D7CA]">AI Tools</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-[#A9C1CB] hidden sm:block">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-[#466F88] rounded-lg hover:bg-[#7DA3AF] transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
