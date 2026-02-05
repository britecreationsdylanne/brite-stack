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
    try {
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
    } catch (err) {
      console.error('Firestore initialization error:', err);
      setError('Ideas feature is not available yet.');
      setLoading(false);
    }
  }, []);

  const addToolRequest = async (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    try {
      await addDoc(collection(db, 'toolRequests'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
        upvoteCount: 0,
        commentCount: 0,
      });
    } catch (err) {
      console.error('Failed to add tool request to Firestore:', err);
      throw err; // Re-throw so the form knows it failed
    }
  };

  return { toolRequests, loading, error, addToolRequest, count: toolRequests.length };
}
