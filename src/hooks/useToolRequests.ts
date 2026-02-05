import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ToolRequest } from '../data/toolRequests';

export function useToolRequests() {
  const [toolRequests, setToolRequests] = useState<ToolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'toolRequests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests: ToolRequest[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            upvoteCount: data.upvoteCount ?? 0,
            commentCount: data.commentCount ?? 0,
          };
        }) as ToolRequest[];
        setToolRequests(requests);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching tool requests:', err);
        setError('Failed to load ideas. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addToolRequest = async (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    await addDoc(collection(db, 'toolRequests'), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    });
  };

  return { toolRequests, loading, error, addToolRequest, count: toolRequests.length };
}
