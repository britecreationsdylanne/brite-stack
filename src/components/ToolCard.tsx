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
      className={`relative bg-[#F4F7FC] rounded-2xl p-6 transition-all duration-200 min-h-[180px] ${
        tool.comingSoon
          ? 'opacity-60 cursor-not-allowed border-2 border-dashed border-[#A9C1CB]'
          : 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:bg-white border-2 border-transparent hover:border-[#31D7CA]'
      }`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#E1E7EF] transition-colors z-10"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          size={22}
          className={isFavorite ? 'text-[#FC883A] fill-[#FC883A]' : 'text-[#A9C1CB] hover:text-[#7DA3AF]'}
        />
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-[#E1E7EF] rounded-2xl flex items-center justify-center mb-5">
        <IconComponent size={32} className="text-[#008182]" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-[#272D3F] mb-2 pr-8">{tool.name}</h3>
      <p className="text-sm text-[#466F88] leading-relaxed">{tool.description}</p>

      {/* Coming Soon Badge */}
      {tool.comingSoon && (
        <div className="absolute top-5 left-5 px-3 py-1 bg-[#466F88] text-white text-xs font-semibold rounded-full">
          Coming Soon
        </div>
      )}
    </div>
  );
}
