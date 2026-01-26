import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { tools } from './data/tools';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ToolGrid } from './components/ToolGrid';
import { RequestToolForm } from './components/RequestToolForm';
import { LoginScreen } from './components/LoginScreen';
import { TechBackground } from './components/TechBackground';
import { LoginPreview } from './components/LoginPreview';

// Set to true to preview login designs, false for normal operation
const PREVIEW_LOGIN_DESIGNS = false;

function App() {
  // Show design preview if enabled
  if (PREVIEW_LOGIN_DESIGNS) {
    return <LoginPreview />;
  }
  const { user, loading, signInWithGoogle } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFavorite = showFavoritesOnly ? isFavorite(tool.id) : true;

      return matchesSearch && matchesFavorite;
    });
  }, [searchQuery, showFavoritesOnly, isFavorite]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <TechBackground />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen relative">
      <TechBackground />

      <div className="relative z-10">
        <Header user={user} />

        <main style={{ maxWidth: '1150px', margin: '0 auto', padding: '30px 50px 60px' }}>
          {/* Hero Section - BriteStack centered */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
              {/* Techy Icon */}
              <div style={{ width: '80px', height: '80px', background: '#272D3F', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(39, 45, 63, 0.4)' }}>
                <svg style={{ width: '50px', height: '50px', color: '#31D7CA' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#272D3F', letterSpacing: '-2px', margin: 0 }}>
                BriteStack
              </h1>
            </div>
            <p style={{ color: '#272D3F', fontSize: '20px', fontWeight: 500, opacity: 0.8, margin: 0 }}>
              Find the tools you need. Built to make your world more efficient.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '50px' }}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />
          </div>

          {/* Tool Grid */}
          <div style={{ marginBottom: '60px' }}>
            <ToolGrid
              tools={filteredTools}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          {/* Request Tool Form */}
          <RequestToolForm userEmail={user.email || undefined} userName={user.name || undefined} />
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 md:py-10 text-[#272D3F] text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} BriteCo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
