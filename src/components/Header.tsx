import { useState, useRef, useEffect } from 'react';

interface AuthUser {
  email: string;
  name: string;
  picture: string;
  displayName?: string;
}

interface HeaderProps {
  user: AuthUser;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-end items-center px-4 py-4 sm:px-6 md:px-[50px] md:py-5">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#272D3F]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-[#272D3F]" />
          )}
          <span className="text-sm text-[#272D3F] hidden md:block font-medium">
            {user.name || user.email}
          </span>
          <svg
            className={`w-4 h-4 text-[#272D3F] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onLogout();
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
