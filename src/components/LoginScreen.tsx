interface LoginScreenProps {
  onSignIn: () => void;
  loading?: boolean;
}

export function LoginScreen({ onSignIn, loading }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-[#272D3F] flex items-center justify-center p-6">
      <div className="bg-[#F4F7FC] rounded-3xl p-10 md:p-14 max-w-lg w-full text-center shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <svg
            width="60"
            height="60"
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
          <div className="text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              <span className="text-[#272D3F]">brite</span>
              <span className="text-[#7DA3AF]">co</span>
            </h1>
            <p className="text-base text-[#008182] font-medium">AI Tools</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-[#272D3F] mb-3">
          Welcome Back
        </h2>
        <p className="text-[#466F88] mb-10 text-lg">
          Sign in to access your AI tools
        </p>

        <button
          onClick={onSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-4 w-full px-8 py-4 bg-white border-2 border-[#E1E7EF] rounded-xl hover:bg-white hover:border-[#31D7CA] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-[#272D3F] font-semibold text-lg">
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>

        <p className="mt-8 text-sm text-[#7DA3AF]">
          Use your BriteCo Google account to sign in
        </p>
      </div>
    </div>
  );
}
