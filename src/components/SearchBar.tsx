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
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
      <input
        type="text"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: '450px',
          padding: '18px 24px 18px 56px',
          borderRadius: '16px',
          border: 'none',
          fontSize: '16px',
          background: '#272D3F',
          color: 'white',
          boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2331D7CA' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '20px center',
          outline: 'none',
        }}
      />
      <button
        onClick={onToggleFavorites}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '16px',
          border: 'none',
          background: showFavoritesOnly ? '#FC883A' : '#272D3F',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: showFavoritesOnly ? 'white' : '#D4AF37',
          boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
        }}
        title={showFavoritesOnly ? 'Show all tools' : 'Show favorites only'}
      >
        <Star size={20} fill={showFavoritesOnly ? 'currentColor' : '#D4AF37'} />
      </button>
    </div>
  );
}
