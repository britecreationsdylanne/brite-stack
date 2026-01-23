import { Search, Star } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 w-full max-w-xl mx-auto">
      <div className="flex-1 relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#466F88]"
        />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#E1E7EF] text-[#272D3F] rounded-lg border-2 border-transparent focus:border-[#31D7CA] focus:outline-none transition-colors placeholder:text-[#466F88]"
        />
      </div>
      <button
        onClick={onToggleFavorites}
        className={`p-3 rounded-lg transition-colors ${
          showFavoritesOnly
            ? 'bg-[#31D7CA] text-[#272D3F]'
            : 'bg-[#E1E7EF] text-[#466F88] hover:bg-[#A9C1CB]'
        }`}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={20} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
