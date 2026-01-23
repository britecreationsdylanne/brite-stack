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

// Colorful backgrounds for each tool - using hex values for inline styles
const colorMap: Record<string, { bg: string; iconBg: string }> = {
  'commercial-wizard': { bg: '#FFF5E6', iconBg: '#FC883A' },
  'briteco-brief': { bg: '#E6F7F7', iconBg: '#31D7CA' },
  'planner-pulse': { bg: '#FDE8F0', iconBg: '#E91E8C' },
  'venue-voice': { bg: '#E8EEF9', iconBg: '#466F88' },
  'stay-in-the-loupe': { bg: '#F4F7FC', iconBg: '#7DA3AF' },
  'ad-generator': { bg: '#FFF0E6', iconBg: '#FF6B35' },
  'video-ad-generator': { bg: '#E8F4E8', iconBg: '#008182' },
};

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || FileText;
  const colors = colorMap[tool.id] || { bg: '#F4F7FC', iconBg: '#008182' };

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
      style={{ backgroundColor: colors.bg }}
      className={`relative rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl ${
        tool.comingSoon
          ? 'opacity-70 cursor-not-allowed border-2 border-dashed border-[#A9C1CB]'
          : 'cursor-pointer hover:-translate-y-1'
      }`}
    >
      {/* Decorative Stars */}
      <div className="absolute top-3 right-14 text-[#D4AF37] opacity-60">
        <Star size={10} fill="currentColor" />
      </div>
      <div className="absolute top-6 right-10 text-[#D4AF37] opacity-40">
        <Star size={8} fill="currentColor" />
      </div>
      <div className="absolute bottom-4 left-4 text-[#D4AF37] opacity-30">
        <Star size={6} fill="currentColor" />
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/50 transition-colors z-10"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          size={20}
          className={isFavorite ? 'text-[#D4AF37]' : 'text-[#D4AF37]/40 hover:text-[#D4AF37]'}
          fill={isFavorite ? '#D4AF37' : 'none'}
        />
      </button>

      {/* Icon with colored background */}
      <div
        style={{ backgroundColor: colors.iconBg }}
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md"
      >
        <IconComponent size={28} className="text-white" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-[#272D3F] mb-2 pr-6">{tool.name}</h3>
      <p className="text-sm text-[#466F88] leading-relaxed">{tool.description}</p>

      {/* Coming Soon Badge */}
      {tool.comingSoon && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-[#466F88] text-white text-xs font-semibold rounded-full">
          Coming Soon
        </div>
      )}
    </div>
  );
}
