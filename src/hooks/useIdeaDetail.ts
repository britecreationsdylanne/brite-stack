import { useState, useEffect, useCallback } from 'react';
import type { Comment, ToolRequest } from '../data/toolRequests';

const API_BASE = 'https://britestack-email-function-279545860595.us-central1.run.app';

export function useIdeaDetail(requestId: string, userEmail: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/ideas/${requestId}`);
      const data = await res.json();
      if (data.success && data.idea) {
        setComments(data.idea.comments || []);
        setUpvoteCount(data.idea.upvoteCount || 0);
        const upvotes = data.idea.upvotes || {};
        setHasUpvoted(!!upvotes[userEmail]);
      }
    } catch (err) {
      console.error('Error fetching idea detail:', err);
    } finally {
      setLoadingComments(false);
    }
  }, [requestId, userEmail]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleUpvote = async (userName: string) => {
    if (!userEmail) return;

    try {
      const res = await fetch(`${API_BASE}/ideas/${requestId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, userName }),
      });

      const data = await res.json();
      if (data.success) {
        setHasUpvoted(data.hasUpvoted);
        setUpvoteCount(data.upvoteCount);
      }
    } catch (err) {
      console.error('Upvote error:', err);
    }
  };

  const addComment = async (text: string, authorName: string, authorEmail: string) => {
    const res = await fetch(`${API_BASE}/ideas/${requestId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, authorName, authorEmail }),
    });

    const data = await res.json();
    if (data.success) {
      setComments((prev) => [...prev, data.comment]);
    }
  };

  const updateStatus = async (newStatus: ToolRequest['status']) => {
    const res = await fetch(`${API_BASE}/ideas/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to update status.');
    }
  };

  return { comments, hasUpvoted, upvoteCount, loadingComments, toggleUpvote, addComment, updateStatus };
}
