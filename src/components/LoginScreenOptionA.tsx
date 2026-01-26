// OPTION A: Stacked Centered (like Brief Generator)
// Icon centered on top, title below, more vertical spacing

interface LoginScreenProps {
  onSignIn: () => void;
  loading?: boolean;
}

export function LoginScreenOptionA({ onSignIn, loading }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a2e]">
      <div className="bg-[#1a1a2e] rounded-[32px] px-16 py-20 max-w-[480px] w-[90%] text-center border border-[rgba(49,215,202,0.15)]">
        {/* Icon centered on top */}
        <div className="flex justify-center mb-6">
          <div className="w-[88px] h-[88px] bg-[rgba(49,215,202,0.12)] rounded-2xl flex items-center justify-center border border-[rgba(49,215,202,0.2)]">
            <svg className="w-12 h-12 text-[#31D7CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        {/* Title below icon */}
        <h1 className="text-[2.5rem] font-extrabold italic text-white leading-tight mb-12">
          Brite<br/>Stack
        </h1>

        {/* Welcome text */}
        <h2 className="text-[1.5rem] font-semibold text-white mb-3">
          Welcome Back
        </h2>
        <p className="text-[#a0aec0] mb-12 text-lg">
          Sign in to access your AI tools
        </p>

        {/* Sign in button */}
        <button
          onClick={onSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-4 w-full px-8 py-4 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#1a1a2e] font-semibold text-lg">
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>

        <p className="mt-10 text-sm text-[#718096]">
          Use your BriteCo Google account to sign in
        </p>
      </div>
    </div>
  );
}
