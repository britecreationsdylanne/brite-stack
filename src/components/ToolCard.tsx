import { Star, Building, FileText, CalendarHeart, Home, Gem, Megaphone, Video, Plus, PenTool } from 'lucide-react';
import type { Tool } from '../data/tools';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>> = {
  building: Building,
  'file-text': FileText,
  'calendar-heart': CalendarHeart,
  home: Home,
  gem: Gem,
  megaphone: Megaphone,
  'pen-tool': PenTool,
  video: Video,
  plus: Plus,
};

// Icon gradient backgrounds for design 13 - dark navy cards with colorful icon backgrounds
const iconGradients: Record<string, string> = {
  'ad-generator': 'linear-gradient(135deg, #EF4444, #DC2626)',
  'briteco-brief': 'linear-gradient(135deg, #31D7CA, #14B8A6)',
  'ceo-article-generator': 'linear-gradient(135deg, #F59E0B, #D97706)',
  'commercial-wizard': 'linear-gradient(135deg, #FC883A, #F97316)',
  'planner-pulse': 'linear-gradient(135deg, #E91E8C, #DB2777)',
  'stay-in-the-loupe': 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  'venue-voice': 'linear-gradient(135deg, #3B82F6, #2563EB)',
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

  const cardStyle: React.CSSProperties = {
    background: '#272D3F',
    borderRadius: '20px',
    padding: '32px 28px',
    position: 'relative',
    cursor: tool.comingSoon ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
    minHeight: '180px',
    opacity: tool.comingSoon ? 0.7 : 1,
    border: tool.comingSoon ? '2px dashed rgba(49, 215, 202, 0.3)' : 'none',
  };

  return (
    <div
      onClick={handleClick}
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!tool.comingSoon) {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(39, 45, 63, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(39, 45, 63, 0.3)';
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          cursor: 'pointer',
          color: '#D4AF37',
          opacity: isFavorite ? 1 : 0.5,
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          size={18}
          fill={isFavorite ? '#D4AF37' : 'none'}
          stroke="#D4AF37"
        />
      </button>

      {/* Coming Soon Badge */}
      {tool.comingSoon && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(49, 215, 202, 0.2)',
          color: '#31D7CA',
          padding: '5px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 600,
        }}>
          Coming Soon
        </div>
      )}

      {/* Icon with gradient background */}
      <div
        style={{
          background: iconGradient,
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
        }}
      >
        <IconComponent size={28} color="white" />
      </div>

      {/* Content */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{tool.name}</h3>
      <p style={{ fontSize: '14px', color: '#A9C1CB', lineHeight: 1.5 }}>{tool.description}</p>
    </div>
  );
}
