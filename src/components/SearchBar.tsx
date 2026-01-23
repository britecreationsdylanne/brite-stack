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
    <div className="flex items-center justify-center gap-3 w-full max-w-xl mx-auto">
      <div className="flex-1 relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7DA3AF]"
        />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-5 py-3.5 bg-white text-[#272D3F] rounded-full shadow-md border-2 border-[#E1E7EF] focus:border-[#31D7CA] focus:outline-none transition-all placeholder:text-[#A9C1CB] text-base"
        />
      </div>
      <button
        onClick={onToggleFavorites}
        className={`p-3.5 rounded-full transition-all shadow-md ${
          showFavoritesOnly
            ? 'bg-[#FC883A] text-white'
            : 'bg-white text-[#D4AF37] border-2 border-[#E1E7EF] hover:border-[#D4AF37]'
        }`}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={22} fill={showFavoritesOnly ? 'currentColor' : '#D4AF37'} />
      </button>
    </div>
  );
}
