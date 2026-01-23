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
    <div className="flex items-center justify-center gap-3 w-full max-w-[500px] mx-auto">
      <div className="flex-1 relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#31D7CA]"
        />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-14 pr-6 py-[18px] bg-[#272D3F] text-white rounded-2xl shadow-[0_8px_30px_rgba(39,45,63,0.3)] border-none focus:outline-none focus:-translate-y-0.5 focus:shadow-[0_12px_40px_rgba(39,45,63,0.4)] transition-all placeholder:text-[#7DA3AF] text-base"
        />
      </div>
      <button
        onClick={onToggleFavorites}
        className={`w-[58px] h-[58px] rounded-2xl flex items-center justify-center transition-all shadow-[0_8px_30px_rgba(39,45,63,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(39,45,63,0.4)] ${
          showFavoritesOnly
            ? 'bg-[#FC883A] text-white'
            : 'bg-[#272D3F] text-[#D4AF37]'
        }`}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={24} fill={showFavoritesOnly ? 'currentColor' : '#D4AF37'} />
      </button>
    </div>
  );
}
