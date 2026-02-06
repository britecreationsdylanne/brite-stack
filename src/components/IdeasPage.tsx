import { useState } from 'react';
import { Lightbulb, Plus, Send, X } from 'lucide-react';
import { IdeaCard } from './IdeaCard';
import { IdeaDetailPage } from './IdeaDetailPage';
import type { ToolRequest } from '../data/toolRequests';

const ADMIN_EMAILS = ['dylanne.crugnale@brite.co', 'dustin.sitar@brite.co'];

interface IdeasPageProps {
  toolRequests: ToolRequest[];
  loading: boolean;
  error: string | null;
  userEmail: string;
  userName: string;
  onAddIdea?: (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => Promise<void>;
}

export function IdeasPage({ toolRequests, loading, error, userEmail, userName, onAddIdea }: IdeasPageProps) {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddIdea || !newToolName.trim() || !newDescription.trim()) return;

    setAddStatus('loading');
    try {
      await onAddIdea({
        toolName: newToolName.trim(),
        description: newDescription.trim(),
        requesterName: userName || 'Admin',
        requesterEmail: userEmail,
      });
      setNewToolName('');
      setNewDescription('');
      setShowAddForm(false);
      setAddStatus('idle');
    } catch (err) {
      console.error('Failed to add idea:', err);
      setAddStatus('error');
    }
  };

  // Detail view
  if (selectedIdeaId) {
    const selectedRequest = toolRequests.find((r) => r.id === selectedIdeaId);
    if (!selectedRequest) {
      setSelectedIdeaId(null);
      return null;
    }
    return (
      <IdeaDetailPage
        request={selectedRequest}
        userEmail={userEmail}
        userName={userName}
        onBack={() => setSelectedIdeaId(null)}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-4 border-[#272D3F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#272D3F] text-lg font-medium">Loading ideas...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-[#272D3F] text-lg font-medium">{error}</p>
      </div>
    );
  }

  // Empty state
  if (toolRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#272D3F', boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)' }}>
          <Lightbulb size={32} className="text-[#31D7CA]" />
        </div>
        <p className="text-[#272D3F] text-xl font-medium">No ideas yet</p>
        <p className="text-[#272D3F]/70 text-sm mt-2">
          {isAdmin ? 'Add the first idea using the button below!' : 'Switch to the Tools tab and submit a tool request to get started!'}
        </p>
        {isAdmin && onAddIdea && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #31D7CA, #008182)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(49, 215, 202, 0.3)',
              marginTop: '16px',
            }}
          >
            <Plus size={18} />
            Add Idea
          </button>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div>
      {/* Admin Add Idea Button */}
      {isAdmin && onAddIdea && !showAddForm && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #31D7CA, #008182)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(49, 215, 202, 0.3)',
            }}
          >
            <Plus size={18} />
            Add Idea
          </button>
        </div>
      )}

      {/* Admin Add Idea Form */}
      {isAdmin && showAddForm && (
        <div style={{
          background: '#272D3F',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(39, 45, 63, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Add New Idea</h3>
            <button
              onClick={() => { setShowAddForm(false); setAddStatus('idle'); }}
              style={{ background: 'none', border: 'none', color: '#7DA3AF', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddIdea}>
            <input
              type="text"
              placeholder="Tool name"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              required
              disabled={addStatus === 'loading'}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid rgba(49, 215, 202, 0.2)',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                outline: 'none',
                marginBottom: '14px',
                boxSizing: 'border-box',
                opacity: addStatus === 'loading' ? 0.6 : 1,
              }}
            />
            <textarea
              placeholder="Description / use case..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              disabled={addStatus === 'loading'}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid rgba(49, 215, 202, 0.2)',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                outline: 'none',
                resize: 'none',
                height: '90px',
                marginBottom: '14px',
                boxSizing: 'border-box',
                opacity: addStatus === 'loading' ? 0.6 : 1,
              }}
            />
            {addStatus === 'error' && (
              <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>Failed to add idea. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={addStatus === 'loading' || !newToolName.trim() || !newDescription.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: addStatus === 'loading' ? 'linear-gradient(135deg, #9CA3AF, #6B7280)' : 'linear-gradient(135deg, #31D7CA, #008182)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: addStatus === 'loading' ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: addStatus === 'loading' ? 'none' : '0 6px 20px rgba(49, 215, 202, 0.3)',
              }}
            >
              <Send size={16} />
              {addStatus === 'loading' ? 'Adding...' : 'Add Idea'}
            </button>
          </form>
        </div>
      )}

      <div className="ideas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {toolRequests.map((request) => (
          <IdeaCard
            key={request.id}
            request={request}
            onClick={() => setSelectedIdeaId(request.id)}
          />
        ))}
      </div>
    </div>
  );
}
