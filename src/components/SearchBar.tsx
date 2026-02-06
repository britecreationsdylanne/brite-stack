import { Star } from 'lucide-react';

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
    <div className="flex justify-center gap-3 px-2 sm:px-0">
      <input
        type="text"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 sm:flex-none sm:w-[350px] md:w-[450px] py-4 px-5 pl-14 rounded-2xl border-none text-base bg-[#272D3F] text-white shadow-[0_8px_30px_rgba(39,45,63,0.3)] outline-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2331D7CA' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '20px center',
        }}
      />
      <button
        onClick={onToggleFavorites}
        className="w-14 h-14 rounded-2xl border-none cursor-pointer flex items-center justify-center shadow-[0_8px_30px_rgba(39,45,63,0.3)] flex-shrink-0"
        style={{
          background: showFavoritesOnly ? '#FC883A' : '#272D3F',
          color: showFavoritesOnly ? 'white' : '#D4AF37',
        }}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={20} fill={showFavoritesOnly ? 'currentColor' : '#D4AF37'} />
      </button>
    </div>
  );
}
