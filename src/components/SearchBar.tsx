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
    <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
      <div className="flex-1 relative">
        <Search
          size={22}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7DA3AF]"
        />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-14 pr-5 py-4 bg-[#F4F7FC] text-[#272D3F] rounded-xl border-2 border-transparent focus:border-[#31D7CA] focus:bg-white focus:outline-none transition-all placeholder:text-[#A9C1CB] text-lg"
        />
      </div>
      <button
        onClick={onToggleFavorites}
        className={`p-4 rounded-xl transition-all ${
          showFavoritesOnly
            ? 'bg-[#FC883A] text-white shadow-lg'
            : 'bg-[#F4F7FC] text-[#7DA3AF] hover:bg-[#E1E7EF] hover:text-[#FC883A]'
        }`}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={24} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
