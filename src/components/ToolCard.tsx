import { Star, Building, FileText, CalendarHeart, Home, Gem, Megaphone, Video } from 'lucide-react';
import type { Tool } from '../data/tools';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  building: Building,
  'file-text': FileText,
  'calendar-heart': CalendarHeart,
  home: Home,
  gem: Gem,
  megaphone: Megaphone,
  video: Video,
};

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || FileText;

  const handleClick = () => {
    if (!tool.comingSoon) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white rounded-xl p-6 shadow-md transition-all duration-200 ${
        tool.comingSoon
          ? 'opacity-70 cursor-not-allowed border-2 border-dashed border-[#A9C1CB]'
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#31D7CA] border-2 border-transparent'
      }`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#E1E7EF] transition-colors"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          size={20}
          className={isFavorite ? 'text-[#FC883A] fill-[#FC883A]' : 'text-[#A9C1CB]'}
        />
      </button>

      {/* Icon */}
      <div className="w-14 h-14 bg-[#E1E7EF] rounded-xl flex items-center justify-center mb-4">
        <IconComponent size={28} className="text-[#008182]" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-[#272D3F] mb-2">{tool.name}</h3>
      <p className="text-sm text-[#466F88]">{tool.description}</p>

      {/* Coming Soon Badge */}
      {tool.comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
          <span className="px-4 py-2 bg-[#466F88] text-white text-sm font-semibold rounded-lg">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}
