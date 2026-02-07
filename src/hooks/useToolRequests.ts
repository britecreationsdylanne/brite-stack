import { useState, useEffect, useCallback } from 'react';
import type { ToolRequest } from '../data/toolRequests';

const API_BASE = 'https://britestack-email-function-279545860595.us-central1.run.app';

export function useToolRequests() {
  const [toolRequests, setToolRequests] = useState<ToolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/ideas`);
      const data = await res.json();
      if (data.success) {
        setToolRequests(data.ideas);
      } else {
        setError('Failed to load ideas.');
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load ideas. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const addToolRequest = async (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    const res = await fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create idea.');
    }

    // Add new idea to local state immediately
    setToolRequests((prev) => [result.idea, ...prev]);
  };

  return { toolRequests, loading, error, addToolRequest, refetch: fetchIdeas, count: toolRequests.length };
}
