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

function App() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
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
        <Header user={user} onLogout={logout} />

        <main className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section - BriteStack centered */}
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-4 md:gap-5 mb-4 md:mb-5">
                {/* Techy Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#272D3F] rounded-[16px] md:rounded-[20px] flex items-center justify-center shadow-[0_10px_40px_rgba(39,45,63,0.4),0_0_30px_rgba(255,255,255,0.1)] relative flex-shrink-0">
                  <div className="absolute inset-[-3px] rounded-[19px] md:rounded-[23px] bg-gradient-to-br from-white/30 to-transparent -z-10" />
                  <svg className="w-9 h-9 md:w-12 md:h-12 text-[#31D7CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#272D3F] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  BriteStack
                </h1>
              </div>
              <p className="text-[#272D3F] text-lg md:text-xl font-medium opacity-85 px-4">
                Find the tools you need. Built to make your world more efficient.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-10 md:mb-14 px-2">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
              />
            </div>

            {/* Tool Grid */}
            <div className="mb-14 md:mb-20">
              <ToolGrid
                tools={filteredTools}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </div>

            {/* Request Tool Form */}
            <RequestToolForm />
          </div>
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
