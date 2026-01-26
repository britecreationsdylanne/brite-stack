// OPTION A: TechBackground with Navy Card (matches main app)

import { TechBackground } from './TechBackground';

interface LoginScreenProps {
  onSignIn: () => void;
  loading?: boolean;
}

export function LoginScreenOptionA({ onSignIn, loading }: LoginScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <TechBackground />
      <div
        style={{
          background: '#272D3F',
          borderRadius: '24px',
          padding: '60px 50px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #31D7CA 0%, #018181 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 30px rgba(49, 215, 202, 0.3)',
          }}
        >
          <svg style={{ width: '48px', height: '48px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: 'white',
            marginBottom: '8px',
            letterSpacing: '-1px',
          }}
        >
          BriteStack
        </h1>
        <p
          style={{
            color: '#31D7CA',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}
        >
          AI Tools Hub
        </p>

        {/* Subtitle */}
        <p
          style={{
            color: '#A9C1CB',
            fontSize: '18px',
            marginBottom: '32px',
            lineHeight: 1.5,
          }}
        >
          Sign in with your BriteCo account to access your AI toolkit
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={onSignIn}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            width: '100%',
            padding: '18px 24px',
            background: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '17px',
            fontWeight: 600,
            color: '#272D3F',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Footer */}
        <p
          style={{
            color: '#6B7C8A',
            fontSize: '13px',
            marginTop: '24px',
          }}
        >
          @brite.co accounts only
        </p>
      </div>
    </div>
  );
}
