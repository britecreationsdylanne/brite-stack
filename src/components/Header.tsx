interface AuthUser {
  email: string;
  name: string;
  picture: string;
  displayName?: string;
}

interface HeaderProps {
  user: AuthUser;
}

export function Header({ user }: HeaderProps) {
  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '20px 50px' }}>
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
