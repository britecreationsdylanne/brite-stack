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

// Icon gradient backgrounds for design 13 - dark navy cards with colorful icon backgrounds
const iconGradients: Record<string, string> = {
  'commercial-wizard': 'linear-gradient(135deg, #FC883A, #F97316)',
  'briteco-brief': 'linear-gradient(135deg, #31D7CA, #14B8A6)',
  'planner-pulse': 'linear-gradient(135deg, #E91E8C, #DB2777)',
  'venue-voice': 'linear-gradient(135deg, #3B82F6, #2563EB)',
  'stay-in-the-loupe': 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  'ad-generator': 'linear-gradient(135deg, #EF4444, #DC2626)',
  'video-ad-generator': 'linear-gradient(135deg, #10B981, #059669)',
};

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || FileText;
  const iconGradient = iconGradients[tool.id] || 'linear-gradient(135deg, #008182, #006666)';

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
      className={`relative bg-[#272D3F] rounded-[20px] md:rounded-[24px] p-6 md:p-8 transition-all duration-300 shadow-[0_8px_30px_rgba(39,45,63,0.3)] min-h-[200px] md:min-h-[220px] ${
        tool.comingSoon
          ? 'opacity-70 cursor-not-allowed border-2 border-dashed border-[#31D7CA]/30'
          : 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(39,45,63,0.5)]'
      }`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-5 right-5 md:top-6 md:right-6 w-10 h-10 rounded-[12px] bg-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 transition-all z-10"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          size={20}
          className={isFavorite ? 'text-[#D4AF37]' : 'text-[#D4AF37]/50 hover:text-[#D4AF37]'}
          fill={isFavorite ? '#D4AF37' : 'none'}
        />
      </button>

      {/* Coming Soon Badge */}
      {tool.comingSoon && (
        <div className="absolute top-5 left-5 md:top-6 md:left-6 px-3 py-1.5 bg-[#31D7CA]/20 text-[#31D7CA] text-xs font-semibold rounded-lg">
          Coming Soon
        </div>
      )}

      {/* Icon with gradient background */}
      <div
        style={{ background: iconGradient }}
        className="w-14 h-14 md:w-16 md:h-16 rounded-[14px] md:rounded-[16px] flex items-center justify-center mb-5 shadow-md"
      >
        <IconComponent size={28} className="text-white md:hidden" />
        <IconComponent size={32} className="text-white hidden md:block" />
      </div>

      {/* Content */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 pr-12">{tool.name}</h3>
      <p className="text-sm md:text-[15px] text-[#A9C1CB] leading-relaxed">{tool.description}</p>
    </div>
  );
}
