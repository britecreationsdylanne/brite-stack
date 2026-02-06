import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { useToolRequests } from './hooks/useToolRequests';
import { tools } from './data/tools';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ToolGrid } from './components/ToolGrid';
import { RequestToolForm } from './components/RequestToolForm';
import { IdeasPage } from './components/IdeasPage';
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
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toolRequests, loading: ideasLoading, error: ideasError, addToolRequest } = useToolRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'ideas' | 'in-progress' | 'completed'>('tools');

  const ideasFiltered = useMemo(() => toolRequests.filter((r) =>
    ['new', 'under-review', 'planned'].includes(r.status)
  ), [toolRequests]);

  const inProgressFiltered = useMemo(() => toolRequests.filter((r) =>
    ['in-progress', 'building'].includes(r.status)
  ), [toolRequests]);

  const completedFiltered = useMemo(() => toolRequests.filter((r) =>
    ['completed', 'launched', 'declined'].includes(r.status)
  ), [toolRequests]);

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

        <main className="max-w-[1150px] mx-auto px-4 sm:px-6 md:px-[50px] py-6 md:py-[30px] pb-12 md:pb-[60px]">
          {/* Hero Section - BriteStack centered */}
          <div className="text-center mb-8 md:mb-[50px]">
            <div className="flex items-center justify-center gap-3 md:gap-5 mb-4 md:mb-5">
              {/* Techy Icon */}
              <div className="w-12 h-12 md:w-20 md:h-20 bg-[#272D3F] rounded-xl md:rounded-[20px] flex items-center justify-center shadow-[0_10px_40px_rgba(39,45,63,0.4)]">
                <svg className="w-7 h-7 md:w-[50px] md:h-[50px] text-[#31D7CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-[64px] font-extrabold text-[#272D3F] tracking-tight md:tracking-[-2px] m-0">
                BriteStack
              </h1>
            </div>
            <p className="text-[#272D3F] text-sm sm:text-base md:text-xl font-medium opacity-80 m-0 px-4">
              Find the tools you need. Built to make your world more efficient.
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex justify-start md:justify-center gap-2 mb-6 md:mb-10 bg-white/15 rounded-2xl p-1.5 mx-auto md:w-fit overflow-x-auto">
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2.5 md:px-8 md:py-3.5 text-sm md:text-[15px] font-semibold border-none cursor-pointer rounded-xl transition-all duration-200 inline-flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-[#272D3F] text-white shadow-[0_4px_15px_rgba(39,45,63,0.3)]'
                  : 'bg-transparent text-[#272D3F]'
              }`}
            >
              Tools
            </button>
            {[
              { key: 'ideas' as const, label: 'Ideas', count: ideasFiltered.length, showCount: true },
              { key: 'in-progress' as const, label: 'In Progress', count: inProgressFiltered.length, showCount: true },
              { key: 'completed' as const, label: 'Completed', count: completedFiltered.length, showCount: false },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 md:px-8 md:py-3.5 text-sm md:text-[15px] font-semibold border-none cursor-pointer rounded-xl transition-all duration-200 inline-flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-[#272D3F] text-white shadow-[0_4px_15px_rgba(39,45,63,0.3)]'
                    : 'bg-transparent text-[#272D3F]'
                }`}
              >
                {tab.label}
                {tab.showCount && tab.count > 0 && (
                  <span className="bg-[#FC883A] text-white text-xs font-bold px-2 py-0.5 rounded-[10px] min-w-[24px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'tools' ? (
            <>
              {/* Search Bar */}
              <div className="mb-8 md:mb-[50px]">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                />
              </div>

              {/* Tool Grid */}
              <div className="mb-10 md:mb-[60px]">
                <ToolGrid
                  tools={filteredTools}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </div>

              {/* Request Tool Form */}
              <RequestToolForm
                userEmail={user.email || undefined}
                userName={user.name || undefined}
                onSubmitToFirestore={addToolRequest}
              />
            </>
          ) : (
            <IdeasPage
              toolRequests={
                activeTab === 'ideas' ? ideasFiltered :
                activeTab === 'in-progress' ? inProgressFiltered :
                completedFiltered
              }
              loading={ideasLoading}
              error={ideasError}
              userEmail={user.email || ''}
              userName={user.name || user.displayName || ''}
            />
          )}
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
