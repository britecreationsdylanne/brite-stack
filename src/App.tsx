import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { tools } from './data/tools';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ToolGrid } from './components/ToolGrid';
import { RequestToolForm } from './components/RequestToolForm';
import { LoginScreen } from './components/LoginScreen';

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
      <div className="min-h-screen bg-[#272D3F] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#31D7CA] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#31D7CA] text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen bg-[#272D3F] overflow-x-hidden">
      <Header user={user} onLogout={logout} />

      <main className="px-6 sm:px-8 md:px-12 lg:px-16 py-12 max-w-5xl mx-auto box-border">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Find the tools <span className="text-[#31D7CA]">you need</span>
          </h2>
          <p className="text-[#A9C1CB] text-lg">
            Built to make your world more efficient
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />
        </div>

        {/* Tool Grid */}
        <div className="mb-16">
          <ToolGrid
            tools={filteredTools}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {/* Request Tool Form */}
        <RequestToolForm />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-[#7DA3AF] text-sm border-t border-[#466F88]/30">
        <p>&copy; {new Date().getFullYear()} BriteCo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
