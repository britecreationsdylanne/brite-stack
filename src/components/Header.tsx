import type { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-5 bg-[#272D3F] border-b border-[#466F88]/30">
      <div className="flex items-center gap-4">
        {/* BriteCo Diamond Logo */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 5L90 45L50 95L10 45L50 5Z"
            fill="#31D7CA"
          />
          <path
            d="M50 5L90 45L50 55L10 45L50 5Z"
            fill="#008182"
          />
        </svg>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-white">brite</span>
            <span className="text-[#7DA3AF]">co</span>
          </h1>
          <p className="text-sm text-[#31D7CA] font-medium">AI Tools</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full border-2 border-[#31D7CA]"
            />
          )}
          <span className="text-sm text-[#A9C1CB] hidden md:block font-medium">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-[#466F88] rounded-xl hover:bg-[#7DA3AF] transition-colors font-medium"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
