import { Lightbulb, User, Calendar, Tag, ThumbsUp, MessageCircle } from 'lucide-react';
import type { ToolRequest } from '../data/toolRequests';

interface IdeaCardProps {
  request: ToolRequest;
  onClick?: () => void;
}

const defaultStatus = { label: 'New', color: '#31D7CA', bg: 'rgba(49, 215, 202, 0.2)' };

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'new':         { label: 'New',         color: '#31D7CA', bg: 'rgba(49, 215, 202, 0.2)' },
  'in-progress': { label: 'In Progress', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.2)' },
  'completed':   { label: 'Completed',   color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
};

function formatDate(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function IdeaCard({ request, onClick }: IdeaCardProps) {
  const status = statusConfig[request.status] || defaultStatus;

  return (
    <div
      className="bg-[#272D3F] rounded-[20px] p-5 sm:p-6 md:px-7 md:py-8 relative transition-all duration-300 shadow-[0_8px_30px_rgba(39,45,63,0.3)]"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(39, 45, 63, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(39, 45, 63, 0.3)';
      }}
    >
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: status.bg,
        color: status.color,
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <Tag size={12} />
        {status.label}
      </div>

      {/* Icon */}
      <div style={{
        background: 'linear-gradient(135deg, #FC883A, #F97316)',
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '18px',
      }}>
        <Lightbulb size={28} color="white" />
      </div>

      {/* Tool Name */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px', paddingRight: '80px' }}>
        {request.toolName}
      </h3>

      {/* Description */}
      <p style={{ fontSize: '14px', color: '#A9C1CB', lineHeight: 1.5, marginBottom: '20px' }}>
        {request.description}
      </p>

      {/* Meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7DA3AF', fontSize: '13px' }}>
          <User size={14} />
          <span>{request.requesterName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7DA3AF', fontSize: '13px' }}>
          <Calendar size={14} />
          <span>{formatDate(request.createdAt)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7DA3AF', fontSize: '13px' }}>
            <ThumbsUp size={14} />
            <span>{request.upvoteCount}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7DA3AF', fontSize: '13px' }}>
            <MessageCircle size={14} />
            <span>{request.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
