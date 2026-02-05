import { useState } from 'react';
import { ArrowLeft, Lightbulb, Tag, User, Calendar, ThumbsUp, MessageCircle, Send, ChevronDown } from 'lucide-react';
import { useIdeaDetail } from '../hooks/useIdeaDetail';
import type { ToolRequest } from '../data/toolRequests';

const ADMIN_EMAILS = ['dylanne.crugnale@brite.co', 'dustin.sitar@brite.co'];

interface IdeaDetailPageProps {
  request: ToolRequest;
  userEmail: string;
  userName: string;
  onBack: () => void;
}

const statusConfig: Record<ToolRequest['status'], { label: string; color: string; bg: string }> = {
  'new':          { label: 'New',          color: '#31D7CA', bg: 'rgba(49, 215, 202, 0.2)' },
  'under-review': { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
  'planned':      { label: 'Planned',      color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.2)' },
  'building':     { label: 'Building',     color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.2)' },
  'launched':     { label: 'Launched',      color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
  'declined':     { label: 'Declined',      color: '#6B7280', bg: 'rgba(107, 114, 128, 0.2)' },
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

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

const allStatuses: ToolRequest['status'][] = ['new', 'under-review', 'planned', 'building', 'launched', 'declined'];

export function IdeaDetailPage({ request, userEmail, userName, onBack }: IdeaDetailPageProps) {
  const { comments, hasUpvoted, loadingComments, toggleUpvote, addComment, updateStatus } = useIdeaDetail(request.id, userEmail);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isAdmin = ADMIN_EMAILS.includes(userEmail);
  const status = statusConfig[request.status] || statusConfig['new'];

  const handleStatusChange = async (newStatus: ToolRequest['status']) => {
    try {
      await updateStatus(newStatus);
      setShowStatusMenu(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleUpvote = async () => {
    try {
      await toggleUpvote(userName);
    } catch (err) {
      console.error('Failed to toggle upvote:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await addComment(commentText.trim(), userName, userEmail);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#272D3F',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: '30px',
          fontFamily: 'inherit',
        }}
      >
        <ArrowLeft size={20} />
        Back to Ideas
      </button>

      {/* Idea Header Card */}
      <div style={{
        background: '#272D3F',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
        marginBottom: '24px',
        position: 'relative',
      }}>
        {/* Status Badge / Admin Dropdown */}
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          {isAdmin ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                style={{
                  background: status.bg,
                  color: status.color,
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Tag size={12} />
                {status.label}
                <ChevronDown size={12} />
              </button>
              {showStatusMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#1e2433',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  zIndex: 50,
                  minWidth: '160px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  {allStatuses.map((s) => {
                    const cfg = statusConfig[s];
                    const isActive = s === request.status;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          color: cfg.color,
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: cfg.color,
                        }} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{
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
          )}
        </div>

        {/* Icon */}
        <div style={{
          background: 'linear-gradient(135deg, #FC883A, #F97316)',
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <Lightbulb size={32} color="white" />
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '12px', paddingRight: '100px' }}>
          {request.toolName}
        </h2>

        {/* Description */}
        <p style={{ fontSize: '16px', color: '#A9C1CB', lineHeight: 1.6, marginBottom: '24px' }}>
          {request.description}
        </p>

        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7DA3AF', fontSize: '14px' }}>
            <User size={16} />
            <span>{request.requesterName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7DA3AF', fontSize: '14px' }}>
            <Calendar size={16} />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Upvote Bar */}
      <div style={{
        background: '#272D3F',
        borderRadius: '16px',
        padding: '20px 28px',
        boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={handleUpvote}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '2px solid',
            borderColor: hasUpvoted ? '#31D7CA' : 'rgba(255, 255, 255, 0.15)',
            background: hasUpvoted ? 'rgba(49, 215, 202, 0.15)' : 'transparent',
            color: hasUpvoted ? '#31D7CA' : '#7DA3AF',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          <ThumbsUp size={18} fill={hasUpvoted ? '#31D7CA' : 'none'} />
          {hasUpvoted ? 'Upvoted' : 'Upvote'}
        </button>
        <span style={{ color: '#7DA3AF', fontSize: '14px' }}>
          {request.upvoteCount} {request.upvoteCount === 1 ? 'person likes' : 'people like'} this idea
        </span>
      </div>

      {/* Comments Section */}
      <div style={{
        background: '#272D3F',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <MessageCircle size={22} color="#31D7CA" />
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
            Comments
          </h3>
          <span style={{
            background: 'rgba(49, 215, 202, 0.2)',
            color: '#31D7CA',
            fontSize: '12px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '10px',
          }}>
            {comments.length}
          </span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '28px' }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment or suggestion..."
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: '2px solid rgba(49, 215, 202, 0.2)',
              borderRadius: '14px',
              fontSize: '15px',
              fontFamily: 'inherit',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              outline: 'none',
              resize: 'none',
              height: '100px',
              opacity: submitting ? 0.6 : 1,
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '12px 24px',
              background: submitting || !commentText.trim()
                ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                : 'linear-gradient(135deg, #31D7CA, #14B8A6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: submitting || !commentText.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: submitting || !commentText.trim()
                ? 'none'
                : '0 6px 20px rgba(49, 215, 202, 0.3)',
            }}
          >
            <Send size={16} />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comment List */}
        {loadingComments ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-3 border-[#31D7CA] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 0',
            color: '#7DA3AF',
            fontSize: '14px',
          }}>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #31D7CA, #008182)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {getInitial(comment.authorName)}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                      {comment.authorName}
                    </div>
                    <div style={{ color: '#7DA3AF', fontSize: '12px' }}>
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <p style={{ color: '#A9C1CB', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
