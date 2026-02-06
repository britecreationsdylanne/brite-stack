import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { IdeaCard } from './IdeaCard';
import { IdeaDetailPage } from './IdeaDetailPage';
import type { ToolRequest } from '../data/toolRequests';

interface IdeasPageProps {
  toolRequests: ToolRequest[];
  loading: boolean;
  error: string | null;
  userEmail: string;
  userName: string;
}

export function IdeasPage({ toolRequests, loading, error, userEmail, userName }: IdeasPageProps) {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

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
          Switch to the Tools tab and submit a tool request to get started!
        </p>
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {toolRequests.map((request) => (
        <IdeaCard
          key={request.id}
          request={request}
          onClick={() => setSelectedIdeaId(request.id)}
        />
      ))}
    </div>
  );
}
