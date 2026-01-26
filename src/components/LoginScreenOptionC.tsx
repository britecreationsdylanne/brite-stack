// OPTION C: Full Teal with Floating Card Effect

interface LoginScreenProps {
  onSignIn: () => void;
  loading?: boolean;
}

export function LoginScreenOptionC({ onSignIn, loading }: LoginScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #31D7CA 0%, #018181 100%)',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '32px',
          padding: '70px 55px',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 30px 100px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '90px',
            height: '90px',
            background: 'linear-gradient(135deg, #31D7CA 0%, #018181 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 15px 40px rgba(1, 129, 129, 0.4)',
          }}
        >
          <svg style={{ width: '52px', height: '52px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '46px',
            fontWeight: 800,
            color: '#272D3F',
            marginBottom: '6px',
            letterSpacing: '-1.5px',
          }}
        >
          BriteStack
        </h1>
        <p
          style={{
            color: '#018181',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '45px',
          }}
        >
          AI Tools Hub
        </p>

        {/* Subtitle */}
        <p
          style={{
            color: '#5A6B7A',
            fontSize: '17px',
            marginBottom: '35px',
            lineHeight: 1.6,
          }}
        >
          Sign in with your BriteCo account<br/>to access your AI toolkit
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
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #018181 0%, #31D7CA 100%)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '17px',
            fontWeight: 600,
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 8px 30px rgba(1, 129, 129, 0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Footer */}
        <p
          style={{
            color: '#9CA3AF',
            fontSize: '13px',
            marginTop: '28px',
          }}
        >
          @brite.co accounts only
        </p>
      </div>
    </div>
  );
}
